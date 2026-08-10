import {
  getFileExtension,
  isPlayableAudioExtension,
  HIFI_WASM_DECODE_MAX_BYTES
} from '@shared/constants/remoteProjectFileLimits';

export type PlaybackStrategy = 'native' | 'wasm' | 'unsupported' | 'download_only';

export interface AudioCapabilityResult {
  strategy: PlaybackStrategy;
  extension: string;
  mimeType: string;
  reason?: string;
}

const MIME_BY_EXT: Record<string, string> = {
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.aif': 'audio/aiff',
  '.aiff': 'audio/aiff'
};

const CAN_PLAY_CANDIDATES: Record<string, string[]> = {
  '.wav': ['audio/wav', 'audio/wave', 'audio/x-wav'],
  '.mp3': ['audio/mpeg', 'audio/mp3'],
  '.flac': ['audio/flac', 'audio/x-flac'],
  '.aif': ['audio/aiff', 'audio/x-aiff'],
  '.aiff': ['audio/aiff', 'audio/x-aiff']
};

function probeCanPlay(mimeTypes: string[]): boolean {
  if (typeof Audio === 'undefined') return false;
  const audio = new Audio();
  return mimeTypes.some((mime) => {
    const result = audio.canPlayType(mime);
    return result === 'probably' || result === 'maybe';
  });
}

/**
 * Decide how to play a remote project audio file with zero re-encode on the native path.
 */
export function resolvePlaybackCapability(
  fileName: string,
  mimeType: string,
  fileSize: number
): AudioCapabilityResult {
  const extension = getFileExtension(fileName);

  if (!isPlayableAudioExtension(extension)) {
    return {
      strategy: 'unsupported',
      extension,
      mimeType,
      reason: 'not_audio'
    };
  }

  const candidates = CAN_PLAY_CANDIDATES[extension] || [mimeType || MIME_BY_EXT[extension]];
  const resolvedMime = mimeType || MIME_BY_EXT[extension] || candidates[0];

  if (probeCanPlay(candidates)) {
    return { strategy: 'native', extension, mimeType: resolvedMime };
  }

  // FLAC / AIFF often need WASM when the browser cannot play natively
  if (extension === '.flac' || extension === '.aif' || extension === '.aiff') {
    if (fileSize > HIFI_WASM_DECODE_MAX_BYTES) {
      return {
        strategy: 'download_only',
        extension,
        mimeType: resolvedMime,
        reason: 'wasm_size_limit'
      };
    }
    return { strategy: 'wasm', extension, mimeType: resolvedMime };
  }

  return {
    strategy: 'unsupported',
    extension,
    mimeType: resolvedMime,
    reason: 'browser_unsupported'
  };
}
