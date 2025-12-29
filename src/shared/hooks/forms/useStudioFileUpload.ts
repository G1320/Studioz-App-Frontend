import { useCallback } from 'react';
import { toast } from 'sonner';
import { uploadFile } from '@shared/services';
import { useTranslation } from 'react-i18next';

export interface UseStudioFileUploadOptions {
  /**
   * Current gallery images array
   */
  galleryImages: string[];

  /**
   * Setter for gallery images
   */
  setGalleryImages: React.Dispatch<React.SetStateAction<string[]>>;

  /**
   * Current gallery audio files array
   */
  galleryAudioFiles: string[];

  /**
   * Setter for gallery audio files
   */
  setGalleryAudioFiles: React.Dispatch<React.SetStateAction<string[]>>;

  /**
   * Current cover image (for edit forms)
   */
  coverImage?: string;

  /**
   * Setter for cover image (for edit forms)
   */
  setCoverImage?: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Whether to handle cover image separately (for edit forms)
   * If true and a single image is uploaded, it will be set as cover image
   */
  handleCoverImageSeparately?: boolean;

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
  galleryImages,
  setGalleryImages,
  setGalleryAudioFiles,
  setCoverImage,
  handleCoverImageSeparately = false
}: UseStudioFileUploadOptions) => {
  const { t } = useTranslation('common');

  const handleFileUpload = useCallback(
    async (files: File[], type: string) => {
      const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
      const fileUrls = results.map((result) => result.secure_url);

      if (type === 'image') {
        // Handle cover image separately (for edit forms)
        if (handleCoverImageSeparately && files.length === 1 && setCoverImage) {
          setCoverImage(fileUrls[0]);
          toast.success(t('toasts.success.coverImageUploaded'));
          return;
        }

        // Handle gallery images
        const wasEmpty = galleryImages.length === 0;

        setGalleryImages((prev) => Array.from(new Set([...prev, ...fileUrls])));

        // Success messages
        if (fileUrls.length === 1 && wasEmpty) {
          toast.success(t('toasts.success.coverImageUploaded'));
        } else {
          toast.success(t('toasts.success.galleryImagesUploaded'));
        }
      } else if (type === 'audio') {
        setGalleryAudioFiles(fileUrls);
        toast.success(t('toasts.success.audioFilesUploaded'));
      }
    },
    [galleryImages.length, handleCoverImageSeparately, setCoverImage, setGalleryImages, setGalleryAudioFiles, t]
  );

  return {
    handleFileUpload
  };
};
