import { useSyncExternalStore } from 'react';
import { getDownloadUrl } from '@shared/services';
import { resolvePlaybackCapability, type PlaybackStrategy } from './audioCapability';
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

export interface HiFiTrackIdentity {
  projectId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
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

class HiFiAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private objectUrl: string | null = null;
  private urlExpiresAt = 0;
  private urlRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  private loadGeneration = 0;

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
    audio.preload = 'metadata';
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
  }

  private scheduleUrlRefresh(track: HiFiTrackIdentity, expiresInSec: number) {
    this.clearUrlRefresh();
    this.urlExpiresAt = Date.now() + expiresInSec * 1000;
    const delay = Math.max(30_000, expiresInSec * 1000 - REFRESH_MARGIN_MS);
    this.urlRefreshTimer = setTimeout(() => {
      void this.refreshUrlIfNeeded(track);
    }, delay);
  }

  private async refreshUrlIfNeeded(track: HiFiTrackIdentity) {
    if (
      !this.snapshot.active ||
      this.snapshot.active.fileId !== track.fileId ||
      this.snapshot.strategy !== 'native'
    ) {
      return;
    }
    try {
      const { downloadUrl, expiresIn } = await getDownloadUrl(track.projectId, track.fileId);
      const audio = this.ensureAudio();
      const wasPlaying = !audio.paused;
      const t = audio.currentTime;
      audio.src = downloadUrl;
      audio.currentTime = t;
      this.scheduleUrlRefresh(track, expiresIn);
      if (wasPlaying) {
        await audio.play();
      }
    } catch (err) {
      console.error('Failed to refresh audio URL', err);
    }
  }

  async loadAndPlay(track: HiFiTrackIdentity): Promise<void> {
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
      const { downloadUrl, expiresIn } = await getDownloadUrl(track.projectId, track.fileId);
      if (generation !== this.loadGeneration) return;

      const audio = this.ensureAudio();

      if (capability.strategy === 'native') {
        audio.src = downloadUrl;
        this.scheduleUrlRefresh(track, expiresIn);
        this.patch({ status: 'ready', strategy: 'native' });
        await audio.play();
        return;
      }

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
      await audio.play();
    } catch (err) {
      if (generation !== this.loadGeneration) return;
      const message = err instanceof Error ? err.message : 'Playback failed';
      this.patch({ status: 'error', error: message });
    }
  }

  async togglePlayPause(track: HiFiTrackIdentity): Promise<void> {
    const isSame =
      this.snapshot.active?.fileId === track.fileId &&
      this.snapshot.active?.projectId === track.projectId;

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

  isActiveFile(projectId: string, fileId: string): boolean {
    return this.snapshot.active?.projectId === projectId && this.snapshot.active?.fileId === fileId;
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
    loadAndPlay: (track: HiFiTrackIdentity) => hiFiAudioEngine.loadAndPlay(track),
    togglePlayPause: (track: HiFiTrackIdentity) => hiFiAudioEngine.togglePlayPause(track),
    seek: (time: number) => hiFiAudioEngine.seek(time),
    setVolume: (volume: number) => hiFiAudioEngine.setVolume(volume),
    setMuted: (muted: boolean) => hiFiAudioEngine.setMuted(muted),
    stop: () => hiFiAudioEngine.stop(),
    isActiveFile: (projectId: string, fileId: string) =>
      hiFiAudioEngine.isActiveFile(projectId, fileId)
  };
}
