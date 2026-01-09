import { useCallback } from 'react';
import { toast } from 'sonner';
import { uploadFile } from '@shared/services';
import { useTranslation } from 'react-i18next';

export interface UseStudioFileUploadOptions {
  /**
   * Setter for gallery images
   */
  setGalleryImages: React.Dispatch<React.SetStateAction<string[]>>;

  /**
   * Setter for gallery audio files
   */
  setGalleryAudioFiles: React.Dispatch<React.SetStateAction<string[]>>;
}


/**
 * Hook for handling studio file uploads
 * Works for both create and edit studio forms
 *
 * @example
 * ```tsx
 * const { handleFileUpload } = useStudioFileUpload({
 *   galleryImages,
 *   setGalleryImages,
 *   galleryAudioFiles,
 *   setGalleryAudioFiles
 * });
 *
 * <FileUploader onFileUpload={handleFileUpload} />
 * ```
 */
export const useStudioFileUpload = ({
  setGalleryImages,
  setGalleryAudioFiles
}: UseStudioFileUploadOptions) => {
  const { t } = useTranslation('common');

  const handleFileUpload = useCallback(
    async (files: File[], type: string) => {
      const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
      const fileUrls = results.map((result) => result.secure_url);

      if (type === 'image') {
        // Always append images to gallery (cover is just galleryImages[0])
        setGalleryImages((prev) => Array.from(new Set([...prev, ...fileUrls])));

        // Success messages
        if (fileUrls.length === 1) {
          toast.success(t('toasts.success.imageUploaded', { defaultValue: 'Image uploaded successfully' }));
        } else {
          toast.success(t('toasts.success.galleryImagesUploaded'));
        }
      } else if (type === 'audio') {
        // Append audio files instead of replacing
        setGalleryAudioFiles((prev) => Array.from(new Set([...prev, ...fileUrls])));
        
        if (fileUrls.length === 1) {
          toast.success(t('toasts.success.audioFileUploaded', { defaultValue: 'Audio file uploaded successfully' }));
        } else {
          toast.success(t('toasts.success.audioFilesUploaded'));
        }
      }
    },
    [setGalleryImages, setGalleryAudioFiles, t]
  );

  return {
    handleFileUpload
  };
};
