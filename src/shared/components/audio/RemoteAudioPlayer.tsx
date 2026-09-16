import { useCallback, useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, MessageSquarePlus, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import {
  buildTrackThread,
  rangeFillStyle,
  resolvePlaybackCapability,
  useAudioMeta,
  useAudioCueComment,
  useHiFiAudioEngine,
  useWaveform
} from '@shared/audio';
import { formatPlaybackTime } from '@shared/audio/formatPlaybackTime';
import { useProjectMessages } from '@shared/hooks';
import { ScrubberCueMarkers } from './ScrubberCueMarkers';
import { WaveformScrubber } from './WaveformScrubber';
import './styles/_remote-audio-player.scss';

interface PlayableRemoteFile {
  _id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

interface RemoteAudioPlayerProps {
  library: 'project' | 'studio';
  containerId: string;
  file: PlayableRemoteFile;
  onDownload?: () => void;
  enableCues?: boolean;
  /**
   * `full`: waveform + transport, always visible (remote project file rows).
   * `compact`: play button only (portfolio tiles; the sticky bar owns transport).
   */
  layout?: 'full' | 'compact';
  /** Show the per-track comment thread toggle in the footer. */
  showThreadToggle?: boolean;
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
  library,
  containerId,
  file,
  onDownload,
  enableCues = library === 'project',
  layout = 'full',
  showThreadToggle = library === 'project'
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
    playAt,
    seek,
    setVolume,
    setMuted
  } = useHiFiAudioEngine();

  // Selected = this file owns the engine (playing or paused)
  const isSelected = active?.fileId === file._id && active?.containerId === containerId && active?.library === library;
  const isPlaying = isSelected && status === 'playing';
  const isBusy =
    isSelected && (status === 'loading_url' || status === 'decoding' || status === 'buffering');

  const { data: meta } = useAudioMeta(library, containerId, file._id, file.fileName, isSelected);
  const waveform = useWaveform(library, containerId, file._id, file.fileName, layout === 'full');
  const { messages } = useProjectMessages({ projectId: enableCues ? containerId : '' });
  const cueComment = useAudioCueComment();
  const [lastMeasuredDuration, setLastMeasuredDuration] = useState(0);

  const thread = useMemo(
    () => (enableCues ? buildTrackThread(messages, file._id) : null),
    [enableCues, messages, file._id]
  );

  const track = useMemo(
    () => ({
      library,
      containerId,
      fileId: file._id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      fileSize: file.fileSize
    }),
    [library, containerId, file._id, file.fileName, file.mimeType, file.fileSize]
  );

  const measuredDuration = isSelected && Number.isFinite(duration) && duration > 0 ? duration : 0;
  useEffect(() => {
    if (measuredDuration > 0) {
      setLastMeasuredDuration(measuredDuration);
    }
  }, [measuredDuration]);

  // Preserve the media element's measured duration after the sticky transport is
  // closed. Otherwise cue positions jump when the engine resets and metadata has
  // a slightly different duration.
  const engineDuration = measuredDuration || lastMeasuredDuration;
  const metaDuration = meta?.durationMs ? meta.durationMs / 1000 : 0;
  const waveformDuration = waveform.durationMs ? waveform.durationMs / 1000 : 0;
  const shownTime = isSelected ? currentTime : 0;
  // Prefer the media element's duration once known; fall back to server-side estimates.
  const displayDuration =
    engineDuration ||
    (metaDuration > 0 ? Math.max(metaDuration, shownTime) : 0) ||
    (waveformDuration > 0 ? Math.max(waveformDuration, shownTime) : shownTime);
  const scrubberMax = Math.max(displayDuration, 0.01);
  const progress = displayDuration > 0 ? Math.min(1, shownTime / displayDuration) : 0;

  const playDisabled =
    capability.strategy === 'unsupported' || capability.strategy === 'download_only';

  const handlePlayPause = useCallback(() => {
    if (playDisabled) return;
    void togglePlayPause(track);
  }, [playDisabled, togglePlayPause, track]);

  const handleSeekFraction = useCallback(
    (fraction: number) => {
      if (playDisabled) return;
      const target = fraction * displayDuration;
      if (isSelected && status !== 'error') {
        seek(target);
        return;
      }
      // Not loaded yet: start playback from the clicked position.
      void playAt(track, displayDuration > 0 ? target : 0);
    },
    [playDisabled, displayDuration, isSelected, status, seek, playAt, track]
  );

  const handleSeekToTime = useCallback(
    (offsetSeconds: number) => {
      if (playDisabled) return;
      if (isSelected && status !== 'error') {
        seek(offsetSeconds);
        return;
      }
      void playAt(track, offsetSeconds);
    },
    [playDisabled, isSelected, status, seek, playAt, track]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Let the waveform slider own arrow keys when it has focus.
      if (e.target !== e.currentTarget) return;
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

  const fidelityLabel = formatFidelity(
    meta?.codec,
    meta?.sampleRate,
    meta?.bitDepth,
    meta?.channels,
    capability.extension
  );

  // Compact: play/pause only — used on portfolio tiles (sticky bar owns transport)
  if (layout === 'compact') {
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
          disabled={playDisabled || (isSelected && isBusy)}
          aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.play')}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
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

  const threadOpen = cueComment?.openThreadFileId === file._id;
  const commentCount = thread?.total ?? 0;
  const openCount = thread?.openCount ?? 0;

  return (
    <div
      ref={rootRef}
      className={`remote-audio-player remote-audio-player--waveform${
        isSelected ? ' remote-audio-player--active' : ''
      }`}
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
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <WaveformScrubber
          className="remote-audio-player__waveform"
          peaks={waveform.peaks}
          loading={waveform.processing}
          progress={progress}
          duration={displayDuration}
          onSeek={playDisabled ? undefined : handleSeekFraction}
          ariaLabel={t('audioPlayer.seek')}
          height={44}
        >
          {enableCues && (
            <ScrubberCueMarkers
              fileId={file._id}
              duration={scrubberMax}
              messages={messages}
              onSeekToTime={handleSeekToTime}
            />
          )}
        </WaveformScrubber>

        {isSelected && (
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
              style={rangeFillStyle(muted ? 0 : volume, 1)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (v > 0 && muted) setMuted(false);
              }}
              aria-label={t('audioPlayer.volume')}
            />
          </div>
        )}
      </div>

      <div className="remote-audio-player__footer">
        <div className="remote-audio-player__time">
          <span>{formatPlaybackTime(shownTime)}</span>
          <span>/</span>
          <span>{displayDuration > 0 ? formatPlaybackTime(displayDuration) : '--:--'}</span>
        </div>
        <span className="remote-audio-player__fidelity">{fidelityLabel}</span>
        {waveform.processing && (
          <span className="remote-audio-player__status">{t('audioPlayer.analyzing')}</span>
        )}
        {statusMessage && <span className="remote-audio-player__status">{statusMessage}</span>}
        {capability.strategy === 'download_only' && onDownload && (
          <button type="button" className="remote-audio-player__link" onClick={onDownload}>
            {t('download')}
          </button>
        )}

        <div className="remote-audio-player__footer-actions">
          {showThreadToggle && cueComment && (
            <button
              type="button"
              className={`remote-audio-player__thread-toggle${
                threadOpen ? ' remote-audio-player__thread-toggle--open' : ''
              }`}
              onClick={() => cueComment.toggleThread(file._id)}
              aria-expanded={threadOpen}
              aria-label={t('trackComments.toggle', { count: commentCount })}
            >
              <MessageSquare size={14} />
              <span>
                {commentCount > 0
                  ? t('trackComments.count', { count: commentCount })
                  : t('trackComments.empty')}
              </span>
              {openCount > 0 && commentCount !== openCount && (
                <span className="remote-audio-player__thread-open">{t('trackComments.open', { count: openCount })}</span>
              )}
            </button>
          )}
          {enableCues && cueComment && isSelected && (
            <button
              type="button"
              className="remote-audio-player__comment"
              onClick={() =>
                cueComment.beginCueComment({
                  ...track,
                  offsetSeconds: currentTime
                })
              }
              aria-label={t('audioPlayer.commentAtTime', { time: formatPlaybackTime(currentTime) })}
            >
              <MessageSquarePlus size={14} />
              {t('audioPlayer.commentAt', { time: formatPlaybackTime(currentTime) })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoteAudioPlayer;
