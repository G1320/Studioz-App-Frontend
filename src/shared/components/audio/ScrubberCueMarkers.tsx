import { type CSSProperties, type FC } from 'react';
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

function senderIdOf(msg: ProjectMessage): string {
  return typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id;
}

function senderNameOf(msg: ProjectMessage, fallback: string): string {
  if (typeof msg.senderId === 'object' && msg.senderId.name?.trim()) {
    return msg.senderId.name.trim();
  }
  return fallback;
}

/** First grapheme of the display name (supports Hebrew / emoji). */
function senderInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const first = [...trimmed][0];
  return first ? first.toLocaleUpperCase() : '?';
}

/** Stable hue per sender so different people read as different colors. */
function senderHue(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  // Skip muddy yellows that fight the brand; keep saturations readable on dark UI.
  return hash % 320;
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
        const roleFallback =
          msg.senderRole === 'customer' || msg.senderRole === 'customer_collaborator'
            ? t('customer')
            : t('vendor');
        const name = senderNameOf(msg, roleFallback);
        const initial = senderInitial(name);
        const hue = senderHue(senderIdOf(msg));

        return (
          <button
            key={msg._id}
            type="button"
            className={`remote-audio-player__marker${resolved ? ' remote-audio-player__marker--resolved' : ''}`}
            style={
              {
                left: `${pct}%`,
                '--marker-hue': String(hue)
              } as CSSProperties
            }
            aria-label={t('audioPlayer.cueMarkerNamed', {
              name,
              time: timeLabel,
              defaultValue: `Comment by {{name}} at {{time}}`
            })}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (seekOnClick) onSeekToTime?.(offset);
              cueContext?.highlightMessage(msg._id, fileId);
            }}
          >
            <span className="remote-audio-player__marker-initial" aria-hidden>
              {initial}
            </span>
            <span className="remote-audio-player__marker-bubble" role="tooltip">
              <span className="remote-audio-player__marker-meta">
                <span className="remote-audio-player__marker-name">{name}</span>
                <span className="remote-audio-player__marker-time">{timeLabel}</span>
              </span>
              <span className="remote-audio-player__marker-text">{msg.message}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
