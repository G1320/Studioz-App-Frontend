import { useQuery } from '@tanstack/react-query';
import { getAudioMeta } from '@shared/services';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';

export function useAudioMeta(projectId: string, fileId: string, fileName: string, enabled = true) {
  return useQuery({
    queryKey: ['projectFileAudioMeta', projectId, fileId],
    queryFn: () => getAudioMeta(projectId, fileId),
    enabled: enabled && !!projectId && !!fileId && isPlayableAudioExtension(fileName),
    staleTime: 30 * 60 * 1000,
    retry: 1
  });
}
