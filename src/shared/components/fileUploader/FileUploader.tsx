import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
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
  fieldNames?: string[];
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
          newErrors.push(`Skipped "${file.name}" because it is not a valid MIME type.`);
        }
        if (!validMimeTypes[file.type]?.includes(extension)) {
          newErrors.push(`Skipped "${file.name}" because an invalid file extension was provided.`);
        }
      });

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            newErrors.push(`Skipped "${file.name}" because it is larger than the maximum 9MB allowed.`);
          } else {
            newErrors.push(`Skipped "${file.name}" due to error: ${error.message}.`);
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
          {isDragActive ? (
            <ArrowDropDownCircleIcon className="icon" />
          ) : (
            <small>{multiple ? `Drop ${fileType} files here` : `Drop your main ${fileType} file here`}</small>
          )}
          {preview ? (
            fileType === 'image' ? (
              <img src={preview} alt="preview" />
            ) : (
              <audio src={preview} controls className="gallery-audio-file" />
            )
          ) : (
            <div className=" upload-icon-container">
              <UploadFileIcon className="icon" />
            </div>
          )}
        </div>

        {isUploading && (
          <div className="file-uploader-loading" role="status" aria-live="polite" aria-label="Uploading files">
            <div className="file-uploader-loading__spinner" />
            <span className="file-uploader-loading__label">Uploading…</span>
          </div>
        )}
      </div>
      {fileType === 'image' ? (
        <GenericImageGallery
          isCoverShown={isCoverShown}
          isGalleryImagesShown={true}
          coverImage={showPreviewBeforeUpload ? preview : ''}
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
