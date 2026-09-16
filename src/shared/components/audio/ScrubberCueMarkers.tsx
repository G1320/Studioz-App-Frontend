import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPlaybackTime } from '@shared/audio/formatPlaybackTime';
import { getMessageFileId, getParentId, isTimedComment } from '@shared/audio/messageCue';
import { useAudioCueComment } from '@shared/audio/AudioCueCommentContext';
import type { ProjectMessage } from 'src/types';

interface ScrubberCueMarkersProps {
  fileId: string;
  duration: number;
  messages: ProjectMessage[];
  /** Seek the engine when a marker is clicked (default true). */
  seekOnClick?: boolean;
  /** Opens or seeks the owning track to the cue time. */
  onSeekToTime?: (offsetSeconds: number) => void;
}

/**
 * Time-coded comment pins rendered over a waveform / scrubber. Only top-level
 * comments get a pin; replies live inside the thread.
 */
export const ScrubberCueMarkers: FC<ScrubberCueMarkersProps> = ({
  fileId,
  duration,
  messages,
  seekOnClick = true,
  onSeekToTime
}) => {
  const { t } = useTranslation('remoteProjects');
  const cueContext = useAudioCueComment();
  if (duration <= 0) return null;

  const cues = messages.filter(
    (msg) => isTimedComment(msg) && getMessageFileId(msg.fileId) === fileId && !getParentId(msg)
  );
  if (cues.length === 0) return null;

  return (
    <div className="remote-audio-player__markers">
      {cues.map((msg) => {
        const offset = msg.offsetSeconds ?? 0;
        const timeLabel = formatPlaybackTime(offset);
        const pct = Math.max(0, Math.min(100, (offset / duration) * 100));
        const resolved = Boolean(msg.resolvedAt);
        return (
          <button
            key={msg._id}
            type="button"
            className={`remote-audio-player__marker${resolved ? ' remote-audio-player__marker--resolved' : ''}`}
            style={{ left: `${pct}%` }}
            aria-label={t('audioPlayer.cueMarker', { time: timeLabel })}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (seekOnClick) onSeekToTime?.(offset);
              cueContext?.highlightMessage(msg._id, fileId);
            }}
          >
            <span className="remote-audio-player__marker-bubble" role="tooltip">
              <span className="remote-audio-player__marker-time">{timeLabel}</span>
              <span className="remote-audio-player__marker-text">{msg.message}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
