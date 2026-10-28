/**
 * Bit-exact remux of uncompressed AIFF / AIFC (NONE, sowt, fl32) to a WAV Blob,
 * preserving sample rate, bit depth and channel count.
 */

function readFourCC(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  );
}

type SampleEncoding = 'int' | 'float';

interface AiffPcm {
  sampleRate: number;
  bitDepth: number;
  bytesPerSample: number;
  channels: number;
  littleEndian: boolean;
  encoding: SampleEncoding;
  pcmOffset: number;
  pcmByteLength: number;
}

const PCM_COMPRESSION: Record<string, { littleEndian: boolean; encoding: SampleEncoding }> = {
  NONE: { littleEndian: false, encoding: 'int' },
  twos: { littleEndian: false, encoding: 'int' },
  sowt: { littleEndian: true, encoding: 'int' },
  fl32: { littleEndian: false, encoding: 'float' },
  FL32: { littleEndian: false, encoding: 'float' }
};

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
      // AIFC: 4-byte compressionType ID follows, then a pascal-string display name
      if (formType === 'AIFC' && chunkSize >= 22) {
        compression = readFourCC(view, dataStart + 18);
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

  const pcmFormat = PCM_COMPRESSION[compression] ?? PCM_COMPRESSION[compression.toUpperCase()];
  if (!pcmFormat) {
    throw new Error(`Compressed AIFF (${compression}) is not supported in-browser`);
  }

  const bytesPerSample = Math.ceil(bitDepth / 8);
  if (pcmFormat.encoding === 'float' ? bitDepth !== 32 : bytesPerSample < 1 || bytesPerSample > 4) {
    throw new Error(`Unsupported AIFF bit depth: ${bitDepth}`);
  }

  const available = Math.min(pcmByteLength, buffer.byteLength - pcmOffset);
  const declared = numSampleFrames * bytesPerSample * channels;
  const frameBytes = bytesPerSample * channels;
  const usable = declared > 0 ? Math.min(available, declared) : available;

  return {
    sampleRate: Math.round(sampleRate),
    bitDepth,
    bytesPerSample,
    channels,
    littleEndian: pcmFormat.littleEndian,
    encoding: pcmFormat.encoding,
    pcmOffset,
    pcmByteLength: usable - (usable % frameBytes)
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

/** Rewrite AIFF sample bytes into WAV byte order (little-endian; 8-bit unsigned) in place. */
function convertSamplesInPlace(pcm: Uint8Array, info: AiffPcm) {
  const { bytesPerSample, littleEndian } = info;

  if (bytesPerSample === 1) {
    // AIFF 8-bit is signed; WAV 8-bit is unsigned
    for (let i = 0; i < pcm.length; i++) pcm[i] ^= 0x80;
    return;
  }

  if (littleEndian) return;

  for (let i = 0; i < pcm.length; i += bytesPerSample) {
    for (let lo = i, hi = i + bytesPerSample - 1; lo < hi; lo++, hi--) {
      const t = pcm[lo];
      pcm[lo] = pcm[hi];
      pcm[hi] = t;
    }
  }
}

function buildWavHeader(info: AiffPcm, dataLength: number): ArrayBuffer {
  const containerBits = info.bytesPerSample * 8;
  const blockAlign = info.channels * info.bytesPerSample;
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  const writeString = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, info.encoding === 'float' ? 3 : 1, true);
  view.setUint16(22, info.channels, true);
  view.setUint32(24, info.sampleRate, true);
  view.setUint32(28, info.sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, containerBits, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);
  return header;
}

/**
 * Converts the sample bytes of `buffer` in place to avoid a second full-size copy,
 * so the input buffer must not be reused by the caller.
 */
export function aiffArrayBufferToWavBlob(buffer: ArrayBuffer): Blob {
  const info = parseAiff(buffer);
  const pcm = new Uint8Array(buffer, info.pcmOffset, info.pcmByteLength);
  convertSamplesInPlace(pcm, info);
  return new Blob([buildWavHeader(info, pcm.byteLength), pcm], { type: 'audio/wav' });
}
