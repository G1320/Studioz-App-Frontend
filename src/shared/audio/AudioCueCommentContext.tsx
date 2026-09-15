import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode
} from 'react';
import type { HiFiTrackIdentity } from './useHiFiAudioEngine';

export interface PendingAudioCue extends HiFiTrackIdentity {
  offsetSeconds: number;
}

interface AudioCueCommentContextValue {
  /** A time-coded comment the user has started from the player / sticky bar. */
  pendingCue: PendingAudioCue | null;
  /** Message id that should flash briefly (after jumping from a marker). */
  highlightedMessageId: string | null;
  /** File whose comment thread is currently expanded. */
  openThreadFileId: string | null;
  beginCueComment: (cue: PendingAudioCue) => void;
  clearPendingCue: () => void;
  openThread: (fileId: string) => void;
  closeThread: () => void;
  toggleThread: (fileId: string) => void;
  highlightMessage: (messageId: string, fileId?: string | null) => void;
}

const AudioCueCommentContext = createContext<AudioCueCommentContextValue | null>(null);

export function messageDomId(messageId: string): string {
  return `project-message-${messageId}`;
}

export const AudioCueCommentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingCue, setPendingCue] = useState<PendingAudioCue | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [openThreadFileId, setOpenThreadFileId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openThread = useCallback((fileId: string) => setOpenThreadFileId(fileId), []);
  const closeThread = useCallback(() => setOpenThreadFileId(null), []);
  const toggleThread = useCallback(
    (fileId: string) => setOpenThreadFileId((current) => (current === fileId ? null : fileId)),
    []
  );

  const beginCueComment = useCallback((cue: PendingAudioCue) => {
    setPendingCue(cue);
    setOpenThreadFileId(cue.fileId);
  }, []);

  const clearPendingCue = useCallback(() => setPendingCue(null), []);

  const highlightMessage = useCallback((messageId: string, fileId?: string | null) => {
    if (fileId) setOpenThreadFileId(fileId);
    setHighlightedMessageId(messageId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedMessageId(null), 2500);
    // Give a collapsed thread a frame to mount before scrolling.
    setTimeout(() => {
      document.getElementById(messageDomId(messageId))?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 60);
  }, []);

  const value = useMemo(
    () => ({
      pendingCue,
      highlightedMessageId,
      openThreadFileId,
      beginCueComment,
      clearPendingCue,
      openThread,
      closeThread,
      toggleThread,
      highlightMessage
    }),
    [
      pendingCue,
      highlightedMessageId,
      openThreadFileId,
      beginCueComment,
      clearPendingCue,
      openThread,
      closeThread,
      toggleThread,
      highlightMessage
    ]
  );

  return (
    <AudioCueCommentContext.Provider value={value}>{children}</AudioCueCommentContext.Provider>
  );
};

export function useAudioCueComment() {
  return useContext(AudioCueCommentContext);
}
