import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPlaybackTime } from '@shared/audio/formatPlaybackTime';
import { getMessageFileId, isTimedComment } from '@shared/audio/messageCue';
import { hiFiAudioEngine } from '@shared/audio/useHiFiAudioEngine';
import { useAudioCueComment } from '@shared/audio/AudioCueCommentContext';
import type { ProjectMessage } from 'src/types';

interface ScrubberCueMarkersProps {
  fileId: string;
  duration: number;
  messages: ProjectMessage[];
}

export const ScrubberCueMarkers: FC<ScrubberCueMarkersProps> = ({
  fileId,
  duration,
  messages
}) => {
  const { t } = useTranslation('remoteProjects');
  const cueContext = useAudioCueComment();
  if (duration <= 0) return null;

  const cues = messages.filter(
    (msg) => isTimedComment(msg) && getMessageFileId(msg.fileId) === fileId
  );
  if (cues.length === 0) return null;

  return (
    <div className="remote-audio-player__markers" aria-hidden={false}>
      {cues.map((msg) => {
        const offset = msg.offsetSeconds ?? 0;
        const pct = Math.max(0, Math.min(100, (offset / duration) * 100));
        const preview = msg.message.length > 80 ? `${msg.message.slice(0, 80)}…` : msg.message;
        return (
          <button
            key={msg._id}
            type="button"
            className="remote-audio-player__marker"
            style={{ insetInlineStart: `${pct}%` }}
            title={`${formatPlaybackTime(offset)} — ${preview}`}
            aria-label={t('audioPlayer.cueMarker', { time: formatPlaybackTime(offset) })}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              hiFiAudioEngine.seek(offset);
              cueContext?.highlightMessage(msg._id);
            }}
          />
        );
      })}
    </div>
  );
};
