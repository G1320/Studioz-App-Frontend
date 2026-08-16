import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type RefObject
} from 'react';
import type { HiFiTrackIdentity } from './useHiFiAudioEngine';

export interface PendingAudioCue extends HiFiTrackIdentity {
  offsetSeconds: number;
}

interface AudioCueCommentContextValue {
  pendingCue: PendingAudioCue | null;
  highlightedMessageId: string | null;
  composerRef: RefObject<HTMLTextAreaElement>;
  beginCueComment: (cue: PendingAudioCue) => void;
  clearPendingCue: () => void;
  highlightMessage: (messageId: string) => void;
}

const AudioCueCommentContext = createContext<AudioCueCommentContextValue | null>(null);

export const AudioCueCommentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingCue, setPendingCue] = useState<PendingAudioCue | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginCueComment = useCallback((cue: PendingAudioCue) => {
    setPendingCue(cue);
    requestAnimationFrame(() => {
      composerRef.current?.focus();
      composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, []);

  const clearPendingCue = useCallback(() => setPendingCue(null), []);

  const highlightMessage = useCallback((messageId: string) => {
    setHighlightedMessageId(messageId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedMessageId(null), 2500);
    requestAnimationFrame(() => {
      document.getElementById(`project-message-${messageId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      pendingCue,
      highlightedMessageId,
      composerRef,
      beginCueComment,
      clearPendingCue,
      highlightMessage
    }),
    [pendingCue, highlightedMessageId, beginCueComment, clearPendingCue, highlightMessage]
  );

  return (
    <AudioCueCommentContext.Provider value={value}>{children}</AudioCueCommentContext.Provider>
  );
};

export function useAudioCueComment() {
  return useContext(AudioCueCommentContext);
}
