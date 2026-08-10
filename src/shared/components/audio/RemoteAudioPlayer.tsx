import { useCallback, useMemo, useRef, type FC, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { ProjectFile } from 'src/types';
import {
  resolvePlaybackCapability,
  useAudioMeta,
  useHiFiAudioEngine
} from '@shared/audio';
import './styles/_remote-audio-player.scss';

interface RemoteAudioPlayerProps {
  projectId: string;
  file: ProjectFile;
  onDownload?: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatFidelity(
  codec: string | null | undefined,
  sampleRate: number | null | undefined,
  bitDepth: number | null | undefined,
  channels: number | null | undefined,
  fallbackExt: string
): string {
  const parts: string[] = [];
  parts.push((codec || fallbackExt.replace('.', '') || 'AUDIO').toUpperCase());
  if (sampleRate) {
    const kHz = sampleRate % 1000 === 0 ? sampleRate / 1000 : (sampleRate / 1000).toFixed(1);
    parts.push(`${kHz} kHz`);
  }
  if (bitDepth) parts.push(`${bitDepth}-bit`);
  if (channels === 1) parts.push('Mono');
  else if (channels === 2) parts.push('2ch');
  else if (channels) parts.push(`${channels}ch`);
  return parts.join(' · ');
}

export const RemoteAudioPlayer: FC<RemoteAudioPlayerProps> = ({
  projectId,
  file,
  onDownload
}) => {
  const { t } = useTranslation('remoteProjects');
  const rootRef = useRef<HTMLDivElement>(null);
  const capability = useMemo(
    () => resolvePlaybackCapability(file.fileName, file.mimeType, file.fileSize),
    [file.fileName, file.mimeType, file.fileSize]
  );

  const {
    active,
    status,
    currentTime,
    duration,
    volume,
    muted,
    error,
    togglePlayPause,
    seek,
    setVolume,
    setMuted
  } = useHiFiAudioEngine();

  // Selected = this file owns the engine (playing or paused) — keep full transport visible
  const isSelected = active?.fileId === file._id && active?.projectId === projectId;
  const isPlaying = isSelected && status === 'playing';
  const isBusy =
    isSelected && (status === 'loading_url' || status === 'decoding' || status === 'buffering');

  const { data: meta } = useAudioMeta(projectId, file._id, file.fileName, isSelected);

  const track = useMemo(
    () => ({
      projectId,
      fileId: file._id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      fileSize: file.fileSize
    }),
    [projectId, file._id, file.fileName, file.mimeType, file.fileSize]
  );

  const engineDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const metaDuration = meta?.durationMs ? meta.durationMs / 1000 : 0;
  // Prefer the media element's duration once known; fall back to header meta.
  // If playback has already passed a stale meta estimate, grow the scrubber with currentTime.
  const displayDuration =
    engineDuration || (metaDuration > 0 ? Math.max(metaDuration, currentTime) : currentTime);
  const scrubberMax = Math.max(displayDuration, 0.01);

  const handlePlayPause = useCallback(() => {
    if (capability.strategy === 'download_only' || capability.strategy === 'unsupported') {
      return;
    }
    void togglePlayPause(track);
  }, [capability.strategy, togglePlayPause, track]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (isSelected && e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      } else if (isSelected && e.code === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      }
    },
    [handlePlayPause, seek, isSelected, currentTime]
  );

  const statusMessage = useMemo(() => {
    if (capability.strategy === 'download_only') {
      return t('audioPlayer.downloadToPlay');
    }
    if (capability.strategy === 'unsupported') {
      return t('audioPlayer.unsupported');
    }
    if (!isSelected) return null;
    if (status === 'loading_url') return t('audioPlayer.loading');
    if (status === 'decoding') return t('audioPlayer.decoding');
    if (status === 'buffering') return t('audioPlayer.buffering');
    if (status === 'error') {
      if (error === 'download_only') return t('audioPlayer.downloadToPlay');
      return t('audioPlayer.error');
    }
    return null;
  }, [capability.strategy, isSelected, status, error, t]);

  const playDisabled =
    capability.strategy === 'unsupported' || capability.strategy === 'download_only';

  const fidelityLabel = formatFidelity(
    meta?.codec,
    meta?.sampleRate,
    meta?.bitDepth,
    meta?.channels,
    capability.extension
  );

  // Compact: play button only (or tiny status for unplayable)
  if (!isSelected) {
    return (
      <div
        ref={rootRef}
        className="remote-audio-player remote-audio-player--compact"
        role="group"
        aria-label={t('audioPlayer.label', { name: file.fileName })}
      >
        <button
          type="button"
          className="remote-audio-player__play"
          onClick={handlePlayPause}
          disabled={playDisabled}
          aria-label={t('audioPlayer.play')}
        >
          <Play size={18} />
        </button>
        {playDisabled && statusMessage && (
          <span className="remote-audio-player__compact-hint">
            {statusMessage}
            {capability.strategy === 'download_only' && onDownload && (
              <>
                {' '}
                <button type="button" className="remote-audio-player__link" onClick={onDownload}>
                  {t('download')}
                </button>
              </>
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="remote-audio-player remote-audio-player--expanded remote-audio-player--active"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={t('audioPlayer.label', { name: file.fileName })}
    >
      <div className="remote-audio-player__row">
        <button
          type="button"
          className="remote-audio-player__play"
          onClick={handlePlayPause}
          disabled={playDisabled || isBusy}
          aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.play')}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <input
          type="range"
          className="remote-audio-player__range remote-audio-player__scrubber"
          min={0}
          max={scrubberMax}
          step={0.01}
          value={Math.min(currentTime, scrubberMax)}
          disabled={scrubberMax <= 0}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label={t('audioPlayer.seek')}
        />

        <div className="remote-audio-player__volume">
          <button
            type="button"
            className="remote-audio-player__mute"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? t('audioPlayer.unmute') : t('audioPlayer.mute')}
          >
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            className="remote-audio-player__range remote-audio-player__volume-slider"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (v > 0 && muted) setMuted(false);
            }}
            aria-label={t('audioPlayer.volume')}
          />
        </div>
      </div>

      <div className="remote-audio-player__footer">
        <div className="remote-audio-player__time">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(displayDuration)}</span>
        </div>
        <span className="remote-audio-player__fidelity">{fidelityLabel}</span>
        {statusMessage && <span className="remote-audio-player__status">{statusMessage}</span>}
      </div>
    </div>
  );
};

export default RemoteAudioPlayer;
