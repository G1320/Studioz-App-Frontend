import './styles/_index.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { UploadIcon, ArrowDropDownIcon } from '@shared/components/icons';
import { GenericImageGallery, GenericAudioGallery } from '@shared/components';
import { toast } from 'sonner';

type OnFileUploadType = (files: File[], type: string) => void | Promise<void>;

interface FileUploaderProps {
  fileType: 'audio' | 'image';
  isCoverShown?: boolean;
  onFileUpload: OnFileUploadType;
  multiple?: boolean;
  galleryFiles?: string[];
  showPreviewBeforeUpload?: boolean;
  errors?: string[];
  hasError?: boolean;
  onRemoveImage?: (image: string) => void;
  onReorderImages?: (reorderedImages: string[]) => void;
}

const validMimeTypes: { [key: string]: string[] } = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/webp': ['.webp'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac']
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  fileType,
  isCoverShown = false,
  onFileUpload,
  multiple = true,
  galleryFiles = [],
  showPreviewBeforeUpload = true,
  hasError = false,
  onRemoveImage,
  onReorderImages
}) => {
  const { t } = useTranslation('forms');
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const gallerySnapshotRef = useRef<string>(JSON.stringify(galleryFiles || []));

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newErrors: string[] = [];
      const hadAcceptedFiles = acceptedFiles.length > 0;

      const showErrorMessages = async (errors: string[]) => {
        for (const error of errors) {
          toast.error(error);
          await delay(700);
        }
      };

      acceptedFiles.forEach((file) => {
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!Object.keys(validMimeTypes).includes(file.type)) {
          newErrors.push(t('form.fileUploader.errors.invalidMimeType', { fileName: file.name }));
        }
        if (!validMimeTypes[file.type]?.includes(extension)) {
          newErrors.push(t('form.fileUploader.errors.invalidExtension', { fileName: file.name }));
        }
      });

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            newErrors.push(t('form.fileUploader.errors.fileTooLarge', { fileName: file.name }));
          } else {
            newErrors.push(t('form.fileUploader.errors.generic', { fileName: file.name, errorMessage: error.message }));
          }
        });
      });

      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        if (showPreviewBeforeUpload) {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setPreview(fileReader.result as string);
            const maybePromise = onFileUpload(acceptedFiles, fileType);
            if (maybePromise && typeof (maybePromise as Promise<void>).finally === 'function') {
              (maybePromise as Promise<void>).finally(() => setIsUploading(false));
            }
          };
          fileReader.readAsDataURL(acceptedFiles[0]);
        } else {
          const maybePromise = onFileUpload(acceptedFiles, fileType);
          if (maybePromise && typeof (maybePromise as Promise<void>).finally === 'function') {
            (maybePromise as Promise<void>).finally(() => setIsUploading(false));
          }
        }
      }

      showErrorMessages(newErrors).finally(() => {
        if (!hadAcceptedFiles) {
          setIsUploading(false);
        }
      });
    },
    [onFileUpload, fileType, showPreviewBeforeUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: 20,
    accept: validMimeTypes,
    maxSize: 9 * 1024 * 1024
  });

  const handleSetPreviewFile = (file: string) => setPreview(file);

  const handleRemoveImage = (image: string) => {
    if (onRemoveImage) {
      onRemoveImage(image);
    }
    if (preview === image) {
      setPreview('');
    }
  };

  // When gallery updates (upload finished), hide loader
  useEffect(() => {
    const snapshot = JSON.stringify(galleryFiles || []);
    if (isUploading && snapshot !== gallerySnapshotRef.current) {
      setIsUploading(false);
    }
    gallerySnapshotRef.current = snapshot;
  }, [galleryFiles, isUploading]);

  return (
    <article className={`file-uploader-container ${hasError ? 'has-error' : ''}`}>
      <div
        className={`file-uploader ${fileType}-uploader ${multiple ? 'multiple' : ''} ${isDragActive ? 'drag-active' : ''} ${hasError ? 'error' : ''}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="file-uploader-content-container">
          {preview ? (
            fileType === 'image' ? (
              <img src={preview} alt="preview" />
            ) : (
              <audio src={preview} controls className="gallery-audio-file" />
            )
          ) : (
            <>
              <div className="upload-icon-container">
                {isDragActive ? (
                  <ArrowDropDownIcon className="icon" />
                ) : (
              <UploadIcon className="icon" />
                )}
            </div>
              <h3 className="upload-heading">
                {t('form.fileUploader.dropZone.heading', { defaultValue: 'Click to upload or drag and drop' })}
              </h3>
              <small>
                {multiple
                  ? t('form.fileUploader.dropZone.multiple', { fileType: t(`form.fileUploader.fileType.${fileType}`) })
                  : t('form.fileUploader.dropZone.single', { fileType: t(`form.fileUploader.fileType.${fileType}`) })}
              </small>
            </>
          )}
        </div>

        {isUploading && (
          <div
            className="file-uploader-loading"
            role="status"
            aria-live="polite"
            aria-label={t('form.fileUploader.uploadingAriaLabel')}
          >
            <div className="file-uploader-loading__spinner" />
            <span className="file-uploader-loading__label">{t('form.fileUploader.uploading')}</span>
          </div>
        )}
      </div>
      {fileType === 'image' ? (
        <GenericImageGallery
          isCoverShown={false}
          isGalleryImagesShown={true}
          galleryImages={galleryFiles}
          onSetPreviewImage={handleSetPreviewFile}
          onRemoveImage={onRemoveImage ? handleRemoveImage : undefined}
          onReorderImages={onReorderImages}
          className="file-uploader-gallery"
        />
      ) : (
        <GenericAudioGallery
          isCoverShown={isCoverShown}
          isAudioFilesShown={true}
          coverAudioFile={preview}
          audioFiles={galleryFiles}
          onSetPreviewAudioFile={handleSetPreviewFile}
        />
      )}
    </article>
  );
};
