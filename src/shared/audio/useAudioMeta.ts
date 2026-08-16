import { useQuery } from '@tanstack/react-query';
import { getAudioMeta, getStudioFileAudioMeta } from '@shared/services';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';
import type { HiFiAudioLibrary } from './useHiFiAudioEngine';

export function useAudioMeta(
  library: HiFiAudioLibrary,
  containerId: string,
  fileId: string,
  fileName: string,
  enabled = true
) {
  return useQuery({
    queryKey: ['fileAudioMeta', library, containerId, fileId],
    queryFn: () =>
      library === 'studio'
        ? getStudioFileAudioMeta(containerId, fileId)
        : getAudioMeta(containerId, fileId),
    enabled: enabled && !!containerId && !!fileId && isPlayableAudioExtension(fileName),
    staleTime: 30 * 60 * 1000,
    retry: 1
  });
}
