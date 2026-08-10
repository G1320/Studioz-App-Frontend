import { useQuery } from '@tanstack/react-query';
import { getDownloadUrl } from '@shared/services';

/**
 * Cache a presigned download URL for streaming playback (not blob download).
 * staleTime is set below typical 24h expiry so React Query refreshes before R2 rejects.
 */
export function useRemoteAudioUrl(projectId: string, fileId: string, enabled = false) {
  return useQuery({
    queryKey: ['projectFileDownloadUrl', projectId, fileId],
    queryFn: () => getDownloadUrl(projectId, fileId),
    enabled: enabled && !!projectId && !!fileId,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 24 * 60 * 60 * 1000
  });
}
