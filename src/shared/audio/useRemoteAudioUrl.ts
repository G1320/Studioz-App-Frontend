import { useQuery } from '@tanstack/react-query';
import { getDownloadUrl, getStudioFileDownloadUrl } from '@shared/services';
import type { HiFiAudioLibrary } from './useHiFiAudioEngine';

/**
 * Cache a presigned download URL for streaming playback (not blob download).
 * staleTime is set below typical 24h expiry so React Query refreshes before R2 rejects.
 */
export function useRemoteAudioUrl(
  library: HiFiAudioLibrary,
  containerId: string,
  fileId: string,
  enabled = false
) {
  return useQuery({
    queryKey: ['fileDownloadUrl', library, containerId, fileId],
    queryFn: () =>
      library === 'studio'
        ? getStudioFileDownloadUrl(containerId, fileId)
        : getDownloadUrl(containerId, fileId),
    enabled: enabled && !!containerId && !!fileId,
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000
  });
}
