/**
 * Convert uncompressed PCM AIFF/AIFC (NONE / sowt) to a WAV Blob, preserving sample rate and bit depth.
 */

function readFourCC(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  );
}

function readPascalString(view: DataView, offset: number): { value: string; bytesRead: number } {
  const length = view.getUint8(offset);
  let value = '';
  for (let i = 0; i < length; i++) {
    value += String.fromCharCode(view.getUint8(offset + 1 + i));
  }
  // Pascal string is padded to even length including length byte
  const total = 1 + length + ((1 + length) % 2);
  return { value, bytesRead: total };
}

interface AiffPcm {
  sampleRate: number;
  bitDepth: number;
  channels: number;
  numSampleFrames: number;
  littleEndian: boolean;
  pcmOffset: number;
  pcmByteLength: number;
}

function parseAiff(buffer: ArrayBuffer): AiffPcm {
  const view = new DataView(buffer);
  if (buffer.byteLength < 12) {
    throw new Error('AIFF file too small');
  }

  const form = readFourCC(view, 0);
  if (form !== 'FORM') {
    throw new Error('Not an AIFF/AIFC file');
  }

  const formType = readFourCC(view, 8);
  if (formType !== 'AIFF' && formType !== 'AIFC') {
    throw new Error('Unsupported FORM type');
  }

  let offset = 12;
  let channels = 0;
  let numSampleFrames = 0;
  let bitDepth = 0;
  let sampleRate = 0;
  let littleEndian = false;
  let pcmOffset = -1;
  let pcmByteLength = 0;
  let compression = 'NONE';

  while (offset + 8 <= view.byteLength) {
    const chunkId = readFourCC(view, offset);
    const chunkSize = view.getUint32(offset + 4, false);
    const dataStart = offset + 8;

    if (chunkId === 'COMM') {
      channels = view.getInt16(dataStart, false);
      numSampleFrames = view.getUint32(dataStart + 2, false);
      bitDepth = view.getInt16(dataStart + 6, false);
      // 80-bit IEEE extended float sample rate (big-endian)
      sampleRate = readExtendedFloat80(view, dataStart + 8);
      if (formType === 'AIFC' && chunkSize >= 22) {
        const pascal = readPascalString(view, dataStart + 18);
        compression = pascal.value || readFourCC(view, dataStart + 18);
      }
    } else if (chunkId === 'SSND') {
      const offsetField = view.getUint32(dataStart, false);
      // skip blockSize at dataStart+4
      pcmOffset = dataStart + 8 + offsetField;
      pcmByteLength = Math.max(0, chunkSize - 8 - offsetField);
    }

    // Chunks are padded to even size
    offset = dataStart + chunkSize + (chunkSize % 2);
  }

  if (!channels || !bitDepth || !sampleRate || pcmOffset < 0) {
    throw new Error('Incomplete AIFF headers');
  }

  const normalized = compression.toUpperCase();
  if (normalized !== 'NONE' && normalized !== 'SOWT' && normalized !== 'NOT COMPRESSED') {
    throw new Error(`Compressed AIFF (${compression}) is not supported in-browser`);
  }

  littleEndian = normalized === 'SOWT';

  return {
    sampleRate: Math.round(sampleRate),
    bitDepth,
    channels,
    numSampleFrames,
    littleEndian,
    pcmOffset,
    pcmByteLength
  };
}

/** Read 80-bit IEEE 754 extended precision (big-endian) as JS number. */
function readExtendedFloat80(view: DataView, offset: number): number {
  const exponent = view.getUint16(offset, false);
  const hi = view.getUint32(offset + 2, false);
  const lo = view.getUint32(offset + 6, false);

  if (exponent === 0 && hi === 0 && lo === 0) return 0;

  const sign = exponent & 0x8000 ? -1 : 1;
  const exp = (exponent & 0x7fff) - 16383;

  // Mantissa is 1.fraction with explicit integer bit in hi MSB
  const mantissa = hi * Math.pow(2, 32) + lo;
  return sign * (mantissa / Math.pow(2, 63)) * Math.pow(2, exp);
}

function writeWavFromPcm(
  pcm: Uint8Array,
  sampleRate: number,
  bitDepth: number,
  channels: number,
  littleEndianSource: boolean
): Blob {
  const bytesPerSample = bitDepth / 8;
  if (![8, 16, 24, 32].includes(bitDepth)) {
    throw new Error(`Unsupported AIFF bit depth: ${bitDepth}`);
  }

  // Ensure sample count aligns
  const frameCount = Math.floor(pcm.byteLength / (bytesPerSample * channels));
  const dataLength = frameCount * bytesPerSample * channels;
  const headerLength = 44;
  const out = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(out);

  const writeString = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  const src = new DataView(pcm.buffer, pcm.byteOffset, dataLength);
  let outOffset = 44;

  for (let i = 0; i < frameCount * channels; i++) {
    const srcOffset = i * bytesPerSample;
    if (bitDepth === 8) {
      // AIFF 8-bit is signed; WAV 8-bit is unsigned
      const sample = src.getInt8(srcOffset);
      view.setUint8(outOffset, sample + 128);
      outOffset += 1;
    } else if (bitDepth === 16) {
      const sample = src.getInt16(srcOffset, littleEndianSource);
      view.setInt16(outOffset, sample, true);
      outOffset += 2;
    } else if (bitDepth === 24) {
      let b0 = src.getUint8(srcOffset);
      let b1 = src.getUint8(srcOffset + 1);
      let b2 = src.getUint8(srcOffset + 2);
      if (!littleEndianSource) {
        // big-endian → little-endian
        const t = b0;
        b0 = b2;
        b2 = t;
      }
      view.setUint8(outOffset, b0);
      view.setUint8(outOffset + 1, b1);
      view.setUint8(outOffset + 2, b2);
      outOffset += 3;
    } else {
      // 32-bit PCM
      const sample = src.getInt32(srcOffset, littleEndianSource);
      view.setInt32(outOffset, sample, true);
      outOffset += 4;
    }
  }

  return new Blob([out], { type: 'audio/wav' });
}

export function aiffArrayBufferToWavBlob(buffer: ArrayBuffer): Blob {
  const info = parseAiff(buffer);
  const end = Math.min(buffer.byteLength, info.pcmOffset + info.pcmByteLength);
  const pcm = new Uint8Array(buffer, info.pcmOffset, end - info.pcmOffset);
  return writeWavFromPcm(pcm, info.sampleRate, info.bitDepth, info.channels, info.littleEndian);
}
