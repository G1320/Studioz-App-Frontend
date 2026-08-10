import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvePlaybackCapability } from '../audioCapability';
import { HIFI_WASM_DECODE_MAX_BYTES } from '@shared/constants/remoteProjectFileLimits';
import { aiffArrayBufferToWavBlob } from '../aiffToWav';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';

function mockCanPlayType(impl: (type: string) => string) {
  vi.stubGlobal(
    'Audio',
    class {
      canPlayType(type: string) {
        return impl(type);
      }
    }
  );
}

describe('isPlayableAudioExtension', () => {
  it('accepts audio stems and rejects zip/mid', () => {
    expect(isPlayableAudioExtension('mix.wav')).toBe(true);
    expect(isPlayableAudioExtension('ref.mp3')).toBe(true);
    expect(isPlayableAudioExtension('stem.flac')).toBe(true);
    expect(isPlayableAudioExtension('bounce.aiff')).toBe(true);
    expect(isPlayableAudioExtension('session.zip')).toBe(false);
    expect(isPlayableAudioExtension('notes.mid')).toBe(false);
  });
});

describe('resolvePlaybackCapability', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses native for wav/mp3 when browser reports support', () => {
    mockCanPlayType((type) =>
      type.includes('wav') || type.includes('mpeg') || type.includes('mp3') ? 'probably' : ''
    );

    expect(resolvePlaybackCapability('a.wav', 'audio/wav', 1024).strategy).toBe('native');
    expect(resolvePlaybackCapability('a.mp3', 'audio/mpeg', 1024).strategy).toBe('native');
  });

  it('falls back to wasm for flac/aiff when unsupported and under size gate', () => {
    mockCanPlayType(() => '');

    expect(resolvePlaybackCapability('a.flac', 'audio/flac', 1024).strategy).toBe('wasm');
    expect(resolvePlaybackCapability('a.aiff', 'audio/aiff', 1024).strategy).toBe('wasm');
  });

  it('returns download_only for large unsupported flac', () => {
    mockCanPlayType(() => '');

    expect(
      resolvePlaybackCapability('big.flac', 'audio/flac', HIFI_WASM_DECODE_MAX_BYTES + 1).strategy
    ).toBe('download_only');
  });

  it('marks zip as unsupported', () => {
    mockCanPlayType(() => 'probably');
    expect(resolvePlaybackCapability('x.zip', 'application/zip', 100).strategy).toBe('unsupported');
  });
});

/** Build a minimal 16-bit mono AIFF with 4 sample frames of silence. */
function buildMinimalAiff(): ArrayBuffer {
  const numChannels = 1;
  const numSampleFrames = 4;
  const bitDepth = 16;
  const ssndDataSize = 8 + numSampleFrames * numChannels * (bitDepth / 8);
  const commSize = 18;
  const formContentSize = 4 + 8 + commSize + 8 + ssndDataSize;
  const buffer = new ArrayBuffer(8 + formContentSize);
  const view = new DataView(buffer);
  const writeFourCC = (offset: number, s: string) => {
    for (let i = 0; i < 4; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeFourCC(0, 'FORM');
  view.setUint32(4, formContentSize, false);
  writeFourCC(8, 'AIFF');

  writeFourCC(12, 'COMM');
  view.setUint32(16, commSize, false);
  view.setInt16(20, numChannels, false);
  view.setUint32(22, numSampleFrames, false);
  view.setInt16(26, bitDepth, false);
  // 80-bit extended float for 44100: exponent 0x400E, mantissa 0xAC44000000000000
  view.setUint16(28, 0x400e, false);
  view.setUint32(30, 0xac440000, false);
  view.setUint32(34, 0x00000000, false);

  writeFourCC(38, 'SSND');
  view.setUint32(42, ssndDataSize, false);
  view.setUint32(46, 0, false); // offset
  view.setUint32(50, 0, false); // block size
  // PCM silence already zero-filled

  return buffer;
}

describe('aiffArrayBufferToWavBlob', () => {
  it('converts uncompressed AIFF PCM to a WAV blob', () => {
    const blob = aiffArrayBufferToWavBlob(buildMinimalAiff());
    expect(blob.type).toBe('audio/wav');
    // 44-byte header + 4 frames * 2 bytes
    expect(blob.size).toBe(52);
  });
});
