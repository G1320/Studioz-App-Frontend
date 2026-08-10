import { audioDataToWavBlob } from './audioBufferToWav';
import { aiffArrayBufferToWavBlob } from './aiffToWav';
import { getFileExtension } from '@shared/constants/remoteProjectFileLimits';

/**
 * Lazy-decode unsupported originals to a lossless WAV Blob for HTMLAudio playback.
 * Uncompressed AIFF uses bit-preserving remux; FLAC (and other compressed) uses audio-decode WASM.
 */
export async function decodeRemoteAudioToWavBlob(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<Blob> {
  const ext = getFileExtension(fileName);

  if (ext === '.aif' || ext === '.aiff') {
    try {
      return aiffArrayBufferToWavBlob(arrayBuffer);
    } catch {
      // Compressed AIFF / exotic variants — fall through to audio-decode
    }
  }

  if (ext === '.flac' || ext === '.aif' || ext === '.aiff') {
    const decode = (await import('audio-decode')).default;
    const audioData = await decode(arrayBuffer);
    return audioDataToWavBlob(audioData);
  }

  throw new Error(`WASM decode is not implemented for ${ext || 'unknown'} files`);
}
