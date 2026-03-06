import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';

export const useAdImages = () => {
  return useQuery({
    queryKey: ['metaAdImages'],
    queryFn: () => metaApi.getAdImages(),
    staleTime: 1000 * 60 * 10
  });
};

export const useAdVideos = () => {
  return useQuery({
    queryKey: ['metaAdVideos'],
    queryFn: () => metaApi.getAdVideos(),
    staleTime: 1000 * 60 * 10
  });
};

export const useUploadImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ filePath, fileName }: { filePath: string; fileName: string }) =>
      metaApi.uploadImage(filePath, fileName),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAdImages'] }); }
  });
};

export const useUploadVideo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ filePath, title }: { filePath: string; title: string }) =>
      metaApi.uploadVideo(filePath, title),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAdVideos'] }); }
  });
};
