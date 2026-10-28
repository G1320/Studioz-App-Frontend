import { useSyncExternalStore } from 'react';
import { getDownloadUrl, getSharedFileStreamUrl, getStudioFileDownloadUrl } from '@shared/services';
import { canDecodeInTab, resolvePlaybackCapability, type PlaybackStrategy } from './audioCapability';
import { decodeRemoteAudioToWavBlob } from './wasmAudioDecode';

export type HiFiEngineStatus =
  | 'idle'
  | 'loading_url'
  | 'decoding'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'error';

export type HiFiAudioLibrary = 'project' | 'studio' | 'share';

export interface HiFiTrackIdentity {
  library: HiFiAudioLibrary;
  /** Project ID, studio ID, or share-link token (for `share`). */
  containerId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  /** Optional cover / project artwork for the sticky transport. */
  artworkUrl?: string;
  /** Optional secondary label (e.g. project title) shown above the track name. */
  contextLabel?: string;
}

async function fetchTrackDownloadUrl(track: HiFiTrackIdentity) {
  if (track.library === 'studio') {
    return getStudioFileDownloadUrl(track.containerId, track.fileId);
  }
  if (track.library === 'share') {
    return getSharedFileStreamUrl(track.containerId, track.fileId);
  }
  // Streaming intent: allowed even while deliverable downloads are locked.
  return getDownloadUrl(track.containerId, track.fileId, 'stream');
}

function isSameTrack(a: HiFiTrackIdentity | null, b: HiFiTrackIdentity): boolean {
  return (
    !!a &&
    a.library === b.library &&
    a.containerId === b.containerId &&
    a.fileId === b.fileId
  );
}

interface HiFiEngineSnapshot {
  active: HiFiTrackIdentity | null;
  status: HiFiEngineStatus;
  strategy: PlaybackStrategy | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error: string | null;
}

type Listener = () => void;

const REFRESH_MARGIN_MS = 5 * 60 * 1000; // refresh URL 5 minutes before expiry
const URL_RECOVERY_COOLDOWN_MS = 30 * 1000;

class HiFiAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private objectUrl: string | null = null;
  private urlExpiresAt = 0;
  private urlRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  private urlRefreshInFlight: Promise<void> | null = null;
  /** Swapping `src` mid-playback is audible, so a due refresh waits for the next pause. */
  private refreshOnPause = false;
  private lastUrlRecoveryAt = 0;
  private loadGeneration = 0;
  private decodeFallbackGeneration = -1;

  private snapshot: HiFiEngineSnapshot = {
    active: null,
    status: 'idle',
    strategy: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    error: null
  };

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  private patch(partial: Partial<HiFiEngineSnapshot>) {
    this.snapshot = { ...this.snapshot, ...partial };
    this.listeners.forEach((l) => l());
  }

  private ensureAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;
    const audio = new Audio();
    // Only the track the user started is ever loaded, so buffer ahead to avoid hi-res stalls.
    audio.preload = 'auto';
    audio.volume = this.snapshot.volume;
    audio.muted = this.snapshot.muted;

    audio.addEventListener('timeupdate', () => {
      this.patch({ currentTime: audio.currentTime });
    });
    audio.addEventListener('durationchange', () => {
      if (Number.isFinite(audio.duration)) {
        this.patch({ duration: audio.duration });
      }
    });
    audio.addEventListener('playing', () => {
      this.patch({ status: 'playing', error: null });
    });
    audio.addEventListener('pause', () => {
      if (this.snapshot.status === 'playing' || this.snapshot.status === 'buffering') {
        this.patch({ status: 'paused' });
      }
      const track = this.snapshot.active;
      if (this.refreshOnPause && track) {
        this.refreshOnPause = false;
        void this.refreshUrlIfNeeded(track);
      }
    });
    audio.addEventListener('waiting', () => {
      if (this.snapshot.status === 'playing') {
        this.patch({ status: 'buffering' });
      }
    });
    audio.addEventListener('ended', () => {
      this.patch({ status: 'paused', currentTime: 0 });
    });
    audio.addEventListener('error', () => {
      const mediaError = audio.error;
      if (this.tryUrlRecovery(mediaError)) return;
      if (this.tryDecodeFallback(mediaError)) return;
      this.patch({
        status: 'error',
        error: mediaError ? `Media error ${mediaError.code}` : 'Playback failed'
      });
    });

    this.audio = audio;
    return audio;
  }

  private revokeObjectUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private clearUrlRefresh() {
    if (this.urlRefreshTimer) {
      clearTimeout(this.urlRefreshTimer);
      this.urlRefreshTimer = null;
    }
    this.refreshOnPause = false;
  }

  private scheduleUrlRefresh(track: HiFiTrackIdentity, expiresInSec: number) {
    this.clearUrlRefresh();
    this.urlExpiresAt = Date.now() + expiresInSec * 1000;
    const delay = Math.max(30_000, expiresInSec * 1000 - REFRESH_MARGIN_MS);
    this.urlRefreshTimer = setTimeout(() => {
      this.urlRefreshTimer = null;
      if (this.audio && !this.audio.paused) {
        this.refreshOnPause = true;
        return;
      }
      void this.refreshUrlIfNeeded(track);
    }, delay);
  }

  private refreshUrlIfNeeded(track: HiFiTrackIdentity): Promise<void> {
    if (
      !this.snapshot.active ||
      !isSameTrack(this.snapshot.active, track) ||
      this.snapshot.strategy !== 'native'
    ) {
      return Promise.resolve();
    }
    if (this.urlRefreshInFlight) return this.urlRefreshInFlight;

    const generation = this.loadGeneration;
    this.urlRefreshInFlight = (async () => {
      try {
        const { downloadUrl, expiresIn } = await fetchTrackDownloadUrl(track);
        if (generation !== this.loadGeneration) return;
        const audio = this.ensureAudio();
        const wasPlaying = !audio.paused;
        const t = audio.currentTime;
        audio.src = downloadUrl;
        this.seekWhenReady(audio, t);
        this.scheduleUrlRefresh(track, expiresIn);
        if (wasPlaying) {
          await audio.play();
        }
      } catch (err) {
        console.error('Failed to refresh audio URL', err);
      } finally {
        this.urlRefreshInFlight = null;
      }
    })();
    return this.urlRefreshInFlight;
  }

  /**
   * A signed URL that expired mid-session (long pause, laptop sleep, very long file) surfaces as a
   * network error, or as SRC_NOT_SUPPORTED when the reload is rejected. Re-sign and resume in place.
   */
  private tryUrlRecovery(mediaError: MediaError | null): boolean {
    const track = this.snapshot.active;
    const audio = this.audio;
    if (!track || !audio || !mediaError || this.snapshot.strategy !== 'native') return false;

    const urlExpired = Date.now() >= this.urlExpiresAt;
    const recoverable =
      mediaError.code === MediaError.MEDIA_ERR_NETWORK ||
      (mediaError.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED && urlExpired);
    if (!recoverable || Date.now() - this.lastUrlRecoveryAt < URL_RECOVERY_COOLDOWN_MS) return false;

    this.lastUrlRecoveryAt = Date.now();
    const generation = this.loadGeneration;
    const resumeAt = this.snapshot.currentTime;
    const wasPlaying = this.snapshot.status === 'playing' || this.snapshot.status === 'buffering';
    this.clearUrlRefresh();
    this.patch({ status: wasPlaying ? 'buffering' : 'paused', error: null });

    void (async () => {
      try {
        const { downloadUrl, expiresIn } = await fetchTrackDownloadUrl(track);
        if (generation !== this.loadGeneration) return;
        audio.src = downloadUrl;
        this.scheduleUrlRefresh(track, expiresIn);
        if (wasPlaying) {
          await this.playFrom(audio, resumeAt);
        } else {
          this.seekWhenReady(audio, resumeAt);
        }
      } catch (err) {
        if (generation !== this.loadGeneration) return;
        const message = err instanceof Error ? err.message : 'Playback failed';
        this.patch({ status: 'error', error: message });
      }
    })();
    return true;
  }

  async loadAndPlay(track: HiFiTrackIdentity, startTime = 0): Promise<void> {
    const generation = ++this.loadGeneration;
    const capability = resolvePlaybackCapability(track.fileName, track.mimeType, track.fileSize);

    this.revokeObjectUrl();
    this.clearUrlRefresh();

    this.patch({
      active: track,
      strategy: capability.strategy,
      status: 'loading_url',
      currentTime: 0,
      duration: 0,
      error: null
    });

    if (capability.strategy === 'unsupported' || capability.strategy === 'download_only') {
      this.patch({
        status: 'error',
        error:
          capability.strategy === 'download_only'
            ? 'download_only'
            : capability.reason || 'unsupported'
      });
      return;
    }

    try {
      const { downloadUrl, expiresIn } = await fetchTrackDownloadUrl(track);
      if (generation !== this.loadGeneration) return;

      const audio = this.ensureAudio();

      if (capability.strategy === 'native') {
        audio.src = downloadUrl;
        this.scheduleUrlRefresh(track, expiresIn);
        this.patch({ status: 'ready', strategy: 'native' });
        await this.playFrom(audio, startTime);
        return;
      }

      await this.decodeAndPlay(track, downloadUrl, startTime, generation);
    } catch (err) {
      if (generation !== this.loadGeneration || this.decodeFallbackGeneration === generation) return;
      const message = err instanceof Error ? err.message : 'Playback failed';
      this.patch({ status: 'error', error: message });
    }
  }

  private async decodeAndPlay(
    track: HiFiTrackIdentity,
    downloadUrl: string,
    startTime: number,
    generation: number
  ): Promise<void> {
    const audio = this.ensureAudio();
    this.patch({ status: 'decoding', strategy: 'wasm' });
    const res = await fetch(downloadUrl, { mode: 'cors' });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    if (generation !== this.loadGeneration) return;

    const wavBlob = await decodeRemoteAudioToWavBlob(arrayBuffer, track.fileName);
    if (generation !== this.loadGeneration) return;

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(wavBlob);
    audio.src = this.objectUrl;
    this.patch({ status: 'ready', strategy: 'wasm' });
    await this.playFrom(audio, startTime);
  }

  /**
   * `canPlayType` only reports container support, so files with an encoding the browser
   * can't handle (e.g. AIFC sowt in Safari, float/extensible WAV in some engines) fail at
   * load time. Retry those once through the in-tab lossless decoder.
   */
  private tryDecodeFallback(mediaError: MediaError | null): boolean {
    const track = this.snapshot.active;
    const generation = this.loadGeneration;
    if (
      !track ||
      this.snapshot.strategy !== 'native' ||
      this.decodeFallbackGeneration === generation ||
      !mediaError ||
      (mediaError.code !== MediaError.MEDIA_ERR_DECODE &&
        mediaError.code !== MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) ||
      !canDecodeInTab(track.fileName, track.fileSize)
    ) {
      return false;
    }

    this.decodeFallbackGeneration = generation;
    this.clearUrlRefresh();
    const resumeAt = this.audio?.currentTime ?? 0;
    this.patch({ status: 'decoding', strategy: 'wasm', error: null });

    void (async () => {
      try {
        // Fresh URL: a SRC_NOT_SUPPORTED error can also mean the signed URL was rejected.
        const { downloadUrl } = await fetchTrackDownloadUrl(track);
        if (generation !== this.loadGeneration) return;
        await this.decodeAndPlay(track, downloadUrl, resumeAt, generation);
      } catch (err) {
        if (generation !== this.loadGeneration) return;
        const message = err instanceof Error ? err.message : 'Playback failed';
        this.patch({ status: 'error', error: message });
      }
    })();
    return true;
  }

  private seekWhenReady(audio: HTMLAudioElement, time: number) {
    if (time <= 0) return;
    if (audio.readyState >= 1) {
      this.seek(time);
      return;
    }
    const onMetadata = () => {
      audio.removeEventListener('loadedmetadata', onMetadata);
      this.seek(time);
    };
    audio.addEventListener('loadedmetadata', onMetadata);
  }

  private async playFrom(audio: HTMLAudioElement, startTime: number): Promise<void> {
    this.seekWhenReady(audio, startTime);
    await audio.play();
  }

  async playAt(track: HiFiTrackIdentity, startTime: number): Promise<void> {
    const isSame = isSameTrack(this.snapshot.active, track);

    if (!isSame || this.snapshot.status === 'idle' || this.snapshot.status === 'error') {
      await this.loadAndPlay(track, startTime);
      return;
    }

    this.seek(startTime);
    const audio = this.ensureAudio();
    if (audio.paused) {
      await audio.play();
    }
  }

  async togglePlayPause(track: HiFiTrackIdentity): Promise<void> {
    const isSame = isSameTrack(this.snapshot.active, track);

    if (!isSame || this.snapshot.status === 'idle' || this.snapshot.status === 'error') {
      await this.loadAndPlay(track);
      return;
    }

    const audio = this.ensureAudio();
    if (audio.paused) {
      if (
        this.snapshot.strategy === 'native' &&
        Date.now() > this.urlExpiresAt - REFRESH_MARGIN_MS
      ) {
        await this.refreshUrlIfNeeded(track);
      }
      await audio.play();
    } else {
      audio.pause();
    }
  }

  seek(time: number) {
    const audio = this.audio;
    if (!audio || !Number.isFinite(time)) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : this.snapshot.duration;
    const clamped = Math.max(0, duration > 0 ? Math.min(time, duration) : time);
    audio.currentTime = clamped;
    this.patch({ currentTime: clamped });
  }

  setVolume(volume: number) {
    const v = Math.max(0, Math.min(1, volume));
    const audio = this.ensureAudio();
    audio.volume = v;
    this.patch({ volume: v });
  }

  setMuted(muted: boolean) {
    const audio = this.ensureAudio();
    audio.muted = muted;
    this.patch({ muted });
  }

  stop() {
    this.loadGeneration += 1;
    this.clearUrlRefresh();
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.revokeObjectUrl();
    this.patch({
      active: null,
      status: 'idle',
      strategy: null,
      currentTime: 0,
      duration: 0,
      error: null
    });
  }

  isActiveFile(library: HiFiAudioLibrary, containerId: string, fileId: string): boolean {
    return (
      this.snapshot.active?.library === library &&
      this.snapshot.active?.containerId === containerId &&
      this.snapshot.active?.fileId === fileId
    );
  }
}

export const hiFiAudioEngine = new HiFiAudioEngine();

export function useHiFiAudioEngine() {
  const snapshot = useSyncExternalStore(
    hiFiAudioEngine.subscribe,
    hiFiAudioEngine.getSnapshot,
    hiFiAudioEngine.getSnapshot
  );

  return {
    ...snapshot,
    loadAndPlay: (track: HiFiTrackIdentity, startTime = 0) =>
      hiFiAudioEngine.loadAndPlay(track, startTime),
    playAt: (track: HiFiTrackIdentity, startTime: number) =>
      hiFiAudioEngine.playAt(track, startTime),
    togglePlayPause: (track: HiFiTrackIdentity) => hiFiAudioEngine.togglePlayPause(track),
    seek: (time: number) => hiFiAudioEngine.seek(time),
    setVolume: (volume: number) => hiFiAudioEngine.setVolume(volume),
    setMuted: (muted: boolean) => hiFiAudioEngine.setMuted(muted),
    stop: () => hiFiAudioEngine.stop(),
    isActiveFile: (library: HiFiAudioLibrary, containerId: string, fileId: string) =>
      hiFiAudioEngine.isActiveFile(library, containerId, fileId)
  };
}
