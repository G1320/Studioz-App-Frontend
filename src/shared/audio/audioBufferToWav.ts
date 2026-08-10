export interface DecodedAudioData {
  channelData: Float32Array[];
  sampleRate: number;
}

/**
 * Encode decoded float PCM as a 32-bit float WAV (preserves float decode fidelity).
 */
export function audioDataToWavBlob(data: DecodedAudioData): Blob {
  const numChannels = data.channelData.length;
  if (numChannels === 0) {
    throw new Error('No audio channels to encode');
  }

  const sampleRate = data.sampleRate;
  const length = data.channelData[0].length;
  const bitDepth = 32;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = length * blockAlign;
  const headerLength = 44;
  const arrayBuffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true); // IEEE float
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      view.setFloat32(offset, data.channelData[ch][i] ?? 0, true);
      offset += 4;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/** @deprecated use audioDataToWavBlob — kept for AudioBuffer callers */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }
  return audioDataToWavBlob({ channelData, sampleRate: buffer.sampleRate });
}
