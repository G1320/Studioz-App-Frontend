import { useCallback } from 'react';
import { toast } from 'sonner';
import { uploadFile } from '@shared/services';
import { enforceImageUploadLimit, mergeGalleryImages } from '@shared/utils/uploadLimits';
import { useSubscription } from '../subscriptions';

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

  /**
   * Maximum free tier images (default: 3)
   */
  maxFreeImages?: number;
}

/**
 * Hook for handling studio file uploads with subscription tier checking and image limits
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
  handleCoverImageSeparately = false,
  maxFreeImages = 3
}: UseStudioFileUploadOptions) => {
  const { isPro, isStarter } = useSubscription();
  const isFreeTier = !isPro && !isStarter;

  const handleFileUpload = useCallback(
    async (files: File[], type: string) => {
      // Enforce free-tier image cap before upload
      if (type === 'image' && isFreeTier) {
        const { allowedFiles, blocked } = enforceImageUploadLimit({
          files,
          currentCount: galleryImages.length,
          isFreeTier,
          maxFreeImages
        });

        if (allowedFiles.length === 0) {
          return toast.error(`Free plan allows up to ${maxFreeImages} photos. Remove some to upload more.`);
        }

        if (blocked > 0) {
          toast.error(
            `Free plan allows ${allowedFiles.length === 1 ? '1 more photo' : `${allowedFiles.length} more photos`}. Extra files skipped.`
          );
        }

        files = allowedFiles;
      }

      const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
      const fileUrls = results.map((result) => result.secure_url);

      if (type === 'image') {
        // Handle cover image separately (for edit forms)
        if (handleCoverImageSeparately && files.length === 1 && setCoverImage) {
          setCoverImage(fileUrls[0]);
          toast.success('Cover image uploaded successfully');
          return;
        }

        // Handle gallery images
        const wasEmpty = galleryImages.length === 0;

        setGalleryImages((prev) => mergeGalleryImages(prev, fileUrls, { isFreeTier, maxFreeImages }));

        // Success messages
        if (fileUrls.length === 1 && wasEmpty) {
          toast.success('Cover image uploaded successfully');
        } else {
          toast.success('Gallery images uploaded successfully');
        }
      } else if (type === 'audio') {
        setGalleryAudioFiles(fileUrls);
        toast.success('Audio files uploaded successfully');
      }
    },
    [
      galleryImages.length,
      isFreeTier,
      maxFreeImages,
      handleCoverImageSeparately,
      setCoverImage,
      setGalleryImages,
      setGalleryAudioFiles
    ]
  );

  return {
    handleFileUpload,
    isFreeTier,
    maxFreeImages
  };
};
