import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play, X } from 'lucide-react';
import { useHiFiAudioEngine } from '@shared/audio';
import './styles/_remote-audio-player.scss';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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

        <div className="sticky-remote-audio-bar__meta">
          <span className="sticky-remote-audio-bar__title" title={active.fileName}>
            {active.fileName}
          </span>
          {statusLabel && (
            <span className="sticky-remote-audio-bar__status">{statusLabel}</span>
          )}
        </div>

        <div className="sticky-remote-audio-bar__transport">
          <input
            type="range"
            className="sticky-remote-audio-bar__scrubber"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            disabled={duration <= 0}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={t('audioPlayer.seek')}
          />
          <div className="sticky-remote-audio-bar__time">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

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
