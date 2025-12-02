import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { uploadFile } from '@shared/services/file-upload-service';
import { toast } from 'sonner';

interface ProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  userId: string;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImageUrl,
  onImageUpload,
  userId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (PNG, JPEG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
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
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  // Extract onClick from getRootProps to ensure it works
  const { onClick, ...rootProps } = getRootProps();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUploading && onClick) {
      onClick(e);
    }
  };

  return (
    <div className="profile-image-uploader" {...rootProps} onClick={handleClick}>
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
            <CameraAltIcon className="profile-image-uploader__icon" />
          </div>
        )}
        <div className="profile-image-uploader__overlay">
          {isUploading ? (
            <div className="profile-image-uploader__spinner"></div>
          ) : (
            <CameraAltIcon className="profile-image-uploader__camera-icon" />
          )}
        </div>
      </div>
    </div>
  );
};

