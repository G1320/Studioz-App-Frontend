import { useQuery } from '@tanstack/react-query';
import { getWaveform } from '@shared/services';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';
import type { WaveformResponse } from 'src/types';
import type { HiFiAudioLibrary } from './useHiFiAudioEngine';

export const waveformQueryKey = (library: HiFiAudioLibrary, containerId: string, fileId: string) =>
  ['fileWaveform', library, containerId, fileId] as const;

/** Poll cadence while the server is still generating peaks. */
const PROCESSING_POLL_MS = 4000;

/**
 * Waveform peaks for a project file. Polls while the backend is generating,
 * then caches indefinitely (peaks never change for a given file).
 */
export function useWaveform(
  library: HiFiAudioLibrary,
  containerId: string,
  fileId: string,
  fileName: string,
  enabled = true
) {
  // Studio portfolio files do not expose a waveform endpoint (yet).
  const supported = library === 'project';

  const query = useQuery<WaveformResponse>({
    queryKey: waveformQueryKey(library, containerId, fileId),
    queryFn: () => getWaveform(containerId, fileId),
    enabled: enabled && supported && !!containerId && !!fileId && isPlayableAudioExtension(fileName),
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status === 'processing' || status === 'pending' ? PROCESSING_POLL_MS : false;
    },
    refetchOnWindowFocus: false
  });

  const data = query.data;
  const peaks = data?.status === 'ready' && data.peaks?.length ? data.peaks : null;
  const processing = !data ? query.isFetching : data.status === 'processing' || data.status === 'pending';

  return {
    peaks,
    durationMs: data?.durationMs ?? null,
    status: data?.status ?? (query.isFetching ? 'processing' : undefined),
    processing,
    isError: query.isError
  };
}
