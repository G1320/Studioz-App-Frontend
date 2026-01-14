import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CameraIcon } from '@shared/components/icons';
import { uploadFile } from '@shared/services/file-upload-service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  userId: string;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImageUrl,
  onImageUpload,
  userId: _userId // Prefixed with _ to indicate intentionally unused
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(t('toasts.error.invalidImageType'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('toasts.error.imageSizeTooLarge'));
        return;
      }

      setIsUploading(true);

      try {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const result = await uploadFile(file);
        const imageUrl = result.secure_url;

        // Call the callback with the new image URL
        onImageUpload(imageUrl);
        toast.success(t('toasts.success.profilePictureUpdated'));
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(t('toasts.error.imageUploadFailed'));
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload, t]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading,
    noClick: false,
    noKeyboard: false
  });

  const displayImage = preview || currentImageUrl;

  return (
    <div className="profile-image-uploader" {...getRootProps()}>
      <input {...getInputProps()} ref={fileInputRef} />
      <div className="profile-image-uploader__container">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="profile-image-uploader__image"
            style={{ opacity: isUploading ? 0.6 : 1 }}
            draggable={false}
          />
        ) : (
          <div className="profile-image-uploader__placeholder">
            <CameraIcon className="profile-image-uploader__icon" />
          </div>
        )}
        <div className="profile-image-uploader__overlay">
          {isUploading ? (
            <div className="profile-image-uploader__spinner"></div>
          ) : (
            <CameraIcon className="profile-image-uploader__camera-icon" />
          )}
        </div>
      </div>
    </div>
  );
};
