/** Per-file upload limit for remote mixing/mastering projects (MB). */
export const REMOTE_PROJECT_MAX_FILE_SIZE_MB = 500;

/**
 * Total files per project — enough for multitrack stems, references, and revisions.
 */
export const REMOTE_PROJECT_MAX_FILES_PER_PROJECT = 50;

/** Standard audio/archive formats accepted for remote mixing services. */
export const REMOTE_PROJECT_ACCEPTED_FILE_TYPES = [
  '.wav',
  '.mp3',
  '.aif',
  '.aiff',
  '.flac',
  '.zip',
  '.mid'
] as const;

/** Extensions the hi-fi player may attempt to play (excludes archives / MIDI). */
export const REMOTE_PROJECT_PLAYABLE_AUDIO_EXTENSIONS = [
  '.wav',
  '.mp3',
  '.aif',
  '.aiff',
  '.flac'
] as const;

export type RemoteProjectPlayableAudioExtension =
  (typeof REMOTE_PROJECT_PLAYABLE_AUDIO_EXTENSIONS)[number];

export function getFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  if (idx < 0) return '';
  return fileName.slice(idx).toLowerCase();
}

export function isPlayableAudioExtension(fileNameOrExt: string): boolean {
  const ext = fileNameOrExt.startsWith('.')
    ? fileNameOrExt.toLowerCase()
    : getFileExtension(fileNameOrExt);
  return (REMOTE_PROJECT_PLAYABLE_AUDIO_EXTENSIONS as readonly string[]).includes(ext);
}

/** Max file size for in-tab WASM decode fallback (bytes). Larger → download hint. */
export const HIFI_WASM_DECODE_MAX_BYTES = 80 * 1024 * 1024;
