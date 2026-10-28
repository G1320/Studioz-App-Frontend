import { describe, it, expect } from 'vitest';
import { aiffArrayBufferToWavBlob } from '../aiffToWav';

interface AiffSpec {
  formType: 'AIFF' | 'AIFC';
  compression?: string;
  compressionName?: string;
  channels: number;
  bitDepth: number;
  sampleRate: number;
  /** Raw SSND sample bytes exactly as they appear on disk. */
  pcm: number[];
}

/** 80-bit IEEE extended encoding for integer sample rates. */
function writeExtended80(view: DataView, offset: number, value: number) {
  const exp = Math.floor(Math.log2(value));
  view.setUint16(offset, 16383 + exp, false);
  const mantissa = value / Math.pow(2, exp);
  const hi = Math.floor(mantissa * Math.pow(2, 31));
  view.setUint32(offset + 2, hi, false);
  view.setUint32(offset + 6, 0, false);
}

function buildAiff(spec: AiffSpec): ArrayBuffer {
  const bytesPerSample = Math.ceil(spec.bitDepth / 8);
  const frames = spec.pcm.length / (bytesPerSample * spec.channels);
  const isAifc = spec.formType === 'AIFC';
  const name = spec.compressionName ?? '';
  const pstringLen = 1 + name.length + ((1 + name.length) % 2);
  const commSize = isAifc ? 18 + 4 + pstringLen : 18;
  const ssndSize = 8 + spec.pcm.length;
  const formSize = 4 + 8 + commSize + 8 + ssndSize + (ssndSize % 2);

  const buffer = new ArrayBuffer(8 + formSize);
  const view = new DataView(buffer);
  const fourCC = (o: number, s: string) => {
    for (let i = 0; i < 4; i++) view.setUint8(o + i, s.charCodeAt(i));
  };

  fourCC(0, 'FORM');
  view.setUint32(4, formSize, false);
  fourCC(8, spec.formType);

  let o = 12;
  fourCC(o, 'COMM');
  view.setUint32(o + 4, commSize, false);
  view.setInt16(o + 8, spec.channels, false);
  view.setUint32(o + 10, frames, false);
  view.setInt16(o + 14, spec.bitDepth, false);
  writeExtended80(view, o + 16, spec.sampleRate);
  if (isAifc) {
    fourCC(o + 26, spec.compression ?? 'NONE');
    view.setUint8(o + 30, name.length);
    for (let i = 0; i < name.length; i++) view.setUint8(o + 31 + i, name.charCodeAt(i));
  }
  o += 8 + commSize;

  fourCC(o, 'SSND');
  view.setUint32(o + 4, ssndSize, false);
  view.setUint32(o + 8, 0, false);
  view.setUint32(o + 12, 0, false);
  spec.pcm.forEach((b, i) => view.setUint8(o + 16 + i, b));

  return buffer;
}

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

async function readWav(blob: Blob) {
  const buf = await blobToArrayBuffer(blob);
  const view = new DataView(buf);
  return {
    format: view.getUint16(20, true),
    channels: view.getUint16(22, true),
    sampleRate: view.getUint32(24, true),
    blockAlign: view.getUint16(32, true),
    bitDepth: view.getUint16(34, true),
    dataLength: view.getUint32(40, true),
    data: Array.from(new Uint8Array(buf, 44))
  };
}

describe('aiffArrayBufferToWavBlob', () => {
  it('remuxes big-endian 24-bit AIFF bit-exactly', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFF',
          channels: 2,
          bitDepth: 24,
          sampleRate: 96000,
          pcm: [0x12, 0x34, 0x56, 0xab, 0xcd, 0xef]
        })
      )
    );
    expect(wav).toMatchObject({ format: 1, channels: 2, sampleRate: 96000, bitDepth: 24, blockAlign: 6 });
    expect(wav.data).toEqual([0x56, 0x34, 0x12, 0xef, 0xcd, 0xab]);
  });

  it('reads the AIFC compression type (NONE) instead of misparsing it as a pascal string', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFC',
          compression: 'NONE',
          compressionName: 'not compressed',
          channels: 1,
          bitDepth: 16,
          sampleRate: 44100,
          pcm: [0x01, 0x02, 0x80, 0x00]
        })
      )
    );
    expect(wav).toMatchObject({ format: 1, sampleRate: 44100, bitDepth: 16 });
    expect(wav.data).toEqual([0x02, 0x01, 0x00, 0x80]);
  });

  it('keeps little-endian AIFC sowt samples untouched', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFC',
          compression: 'sowt',
          channels: 1,
          bitDepth: 16,
          sampleRate: 48000,
          pcm: [0x01, 0x02, 0x03, 0x04]
        })
      )
    );
    expect(wav.data).toEqual([0x01, 0x02, 0x03, 0x04]);
  });

  it('pads non-byte-aligned bit depths into their storage container', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFF',
          channels: 1,
          bitDepth: 20,
          sampleRate: 48000,
          pcm: [0x12, 0x34, 0x50]
        })
      )
    );
    expect(wav).toMatchObject({ format: 1, bitDepth: 24, blockAlign: 3 });
    expect(wav.data).toEqual([0x50, 0x34, 0x12]);
  });

  it('remuxes AIFC fl32 to IEEE float WAV bit-exactly', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFC',
          compression: 'fl32',
          channels: 1,
          bitDepth: 32,
          sampleRate: 48000,
          pcm: [0x3f, 0x00, 0x00, 0x00]
        })
      )
    );
    expect(wav).toMatchObject({ format: 3, bitDepth: 32 });
    expect(wav.data).toEqual([0x00, 0x00, 0x00, 0x3f]);
  });

  it('converts signed 8-bit AIFF to unsigned 8-bit WAV', async () => {
    const wav = await readWav(
      aiffArrayBufferToWavBlob(
        buildAiff({ formType: 'AIFF', channels: 1, bitDepth: 8, sampleRate: 22050, pcm: [0x00, 0x80, 0x7f] })
      )
    );
    expect(wav.data).toEqual([0x80, 0x00, 0xff]);
  });

  it('rejects genuinely compressed AIFC so the decoder fallback can take over', () => {
    expect(() =>
      aiffArrayBufferToWavBlob(
        buildAiff({
          formType: 'AIFC',
          compression: 'ima4',
          channels: 1,
          bitDepth: 16,
          sampleRate: 44100,
          pcm: [0, 0]
        })
      )
    ).toThrow(/Compressed AIFF/);
  });
});
