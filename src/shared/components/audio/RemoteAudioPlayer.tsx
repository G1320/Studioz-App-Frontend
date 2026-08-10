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

  const isActive = active?.fileId === file._id && active?.projectId === projectId;
  const isPlaying = isActive && status === 'playing';
  const isBusy =
    isActive && (status === 'loading_url' || status === 'decoding' || status === 'buffering');

  const { data: meta } = useAudioMeta(projectId, file._id, file.fileName, true);

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

  const displayDuration =
    isActive && duration > 0
      ? duration
      : meta?.durationMs
        ? meta.durationMs / 1000
        : 0;

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
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek((isActive ? currentTime : 0) - 5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek((isActive ? currentTime : 0) + 5);
      }
    },
    [handlePlayPause, seek, isActive, currentTime]
  );

  const statusMessage = useMemo(() => {
    if (capability.strategy === 'download_only') {
      return t('audioPlayer.downloadToPlay');
    }
    if (capability.strategy === 'unsupported') {
      return t('audioPlayer.unsupported');
    }
    if (!isActive) return null;
    if (status === 'loading_url') return t('audioPlayer.loading');
    if (status === 'decoding') return t('audioPlayer.decoding');
    if (status === 'buffering') return t('audioPlayer.buffering');
    if (status === 'error') {
      if (error === 'download_only') return t('audioPlayer.downloadToPlay');
      return t('audioPlayer.error');
    }
    return null;
  }, [capability.strategy, isActive, status, error, t]);

  const playDisabled =
    capability.strategy === 'unsupported' || capability.strategy === 'download_only';

  const fidelityLabel = formatFidelity(
    meta?.codec,
    meta?.sampleRate,
    meta?.bitDepth,
    meta?.channels,
    capability.extension
  );

  return (
    <div
      ref={rootRef}
      className={`remote-audio-player ${isActive ? 'remote-audio-player--active' : ''}`}
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

        <div className="remote-audio-player__transport">
          <input
            type="range"
            className="remote-audio-player__scrubber"
            min={0}
            max={displayDuration || 0}
            step={0.01}
            value={isActive ? currentTime : 0}
            disabled={!isActive || displayDuration <= 0}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={t('audioPlayer.seek')}
          />
          <div className="remote-audio-player__time">
            <span>{formatTime(isActive ? currentTime : 0)}</span>
            <span>/</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>

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
            className="remote-audio-player__volume-slider"
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

      <div className="remote-audio-player__meta">
        <span className="remote-audio-player__fidelity">{fidelityLabel}</span>
        {statusMessage && (
          <span className="remote-audio-player__status">
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
    </div>
  );
};

export default RemoteAudioPlayer;
