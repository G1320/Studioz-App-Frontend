import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquarePlus, Pause, Play, X } from 'lucide-react';
import {
  formatPlaybackTime,
  rangeFillStyle,
  useAudioCueComment,
  useHiFiAudioEngine
} from '@shared/audio';
import { useProjectMessages } from '@shared/hooks';
import { ScrubberCueMarkers } from './ScrubberCueMarkers';
import './styles/_remote-audio-player.scss';

const VISIBLE_STATUSES = new Set([
  'loading_url',
  'decoding',
  'ready',
  'playing',
  'paused',
  'buffering'
]);

/**
 * Fixed bottom transport while a remote project file is loaded in the hi-fi engine.
 */
export const StickyRemoteAudioBar: FC = () => {
  const { t } = useTranslation('remoteProjects');
  const { active, status, currentTime, duration, togglePlayPause, seek, stop } =
    useHiFiAudioEngine();
  const cueComment = useAudioCueComment();
  const showCues = active?.library === 'project';
  const { messages } = useProjectMessages({
    projectId: showCues ? active?.containerId || '' : ''
  });

  const visible = !!active && VISIBLE_STATUSES.has(status);
  const isPlaying = status === 'playing';
  const isBusy = status === 'loading_url' || status === 'decoding' || status === 'buffering';

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '5.5rem';
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [visible]);

  const statusLabel = useMemo(() => {
    if (status === 'loading_url') return t('audioPlayer.loading');
    if (status === 'decoding') return t('audioPlayer.decoding');
    if (status === 'buffering') return t('audioPlayer.buffering');
    return null;
  }, [status, t]);

  const handlePlayPause = useCallback(() => {
    if (!active) return;
    void togglePlayPause(active);
  }, [active, togglePlayPause]);

  if (!visible || !active) return null;

  const scrubberMax = Math.max(duration || 0, currentTime, 0.01);
  const scrubberValue = Math.min(currentTime, scrubberMax);

  return (
    <div
      className="sticky-remote-audio-bar"
      role="region"
      aria-label={t('audioPlayer.stickyLabel', { name: active.fileName })}
    >
      <div className="sticky-remote-audio-bar__inner">
        <button
          type="button"
          className="sticky-remote-audio-bar__play"
          onClick={handlePlayPause}
          disabled={isBusy && !isPlaying}
          aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.play')}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="sticky-remote-audio-bar__transport">
          <div className="remote-audio-player__scrubber-wrap">
            <input
              type="range"
              className="remote-audio-player__range sticky-remote-audio-bar__scrubber"
              min={0}
              max={scrubberMax}
              step={0.01}
              value={scrubberValue}
              disabled={scrubberMax <= 0}
              style={rangeFillStyle(scrubberValue, scrubberMax)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={t('audioPlayer.seek')}
            />
            {showCues && active && (
              <ScrubberCueMarkers
                fileId={active.fileId}
                duration={scrubberMax}
                messages={messages}
              />
            )}
          </div>
          <div className="sticky-remote-audio-bar__time">
            <span>{formatPlaybackTime(currentTime)}</span>
            <span>/</span>
            <span>{formatPlaybackTime(duration > 0 ? duration : scrubberMax)}</span>
          </div>
        </div>

        <div className="sticky-remote-audio-bar__meta">
          <span className="sticky-remote-audio-bar__title" title={active.fileName}>
            {active.fileName}
          </span>
          {statusLabel && (
            <span className="sticky-remote-audio-bar__status">{statusLabel}</span>
          )}
        </div>
        {showCues && cueComment && (
          <button
            type="button"
            className="sticky-remote-audio-bar__comment"
            onClick={() =>
              cueComment.beginCueComment({
                ...active,
                offsetSeconds: currentTime
              })
            }
            aria-label={t('audioPlayer.commentAtTime', { time: formatPlaybackTime(currentTime) })}
          >
            <MessageSquarePlus size={16} />
          </button>
        )}
        <button
          type="button"
          className="sticky-remote-audio-bar__close"
          onClick={() => stop()}
          aria-label={t('audioPlayer.stop')}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default StickyRemoteAudioBar;
