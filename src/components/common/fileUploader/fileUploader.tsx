import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { GenericImageGallery, GenericAudioGallery } from '@components/index';
import { toast } from 'sonner';

type OnFileUploadType = (files: File[], type: string) => void;

interface FileUploaderProps {
  fileType: 'audio' | 'image';
  isCoverShown?: boolean;
  onFileUpload: OnFileUploadType;
  multiple?: boolean;
  galleryFiles?: string[];
}

// interface FileRejection {
//   file: File;
//   errors: DropzoneError[];
// }

// interface DropzoneError {
//   code: string;
//   message: string;
// }

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
  galleryFiles = []
}) => {
  const [preview, setPreview] = useState<string>('');

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newErrors: string[] = [];

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
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setPreview(fileReader.result as string);
          onFileUpload(acceptedFiles, fileType);
        };
        fileReader.readAsDataURL(acceptedFiles[0]);
      }

      showErrorMessages(newErrors);
    },
    [onFileUpload, fileType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: 20,
    accept: validMimeTypes,
    maxSize: 9 * 1024 * 1024
  });

  const handleSetPreviewFile = (file: string) => setPreview(file);

  return (
    <article>
      <div className={`file-uploader ${fileType}-uploader preview ${multiple ? 'multiple' : ''}`} {...getRootProps()}>
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
      </div>
      {fileType === 'image' ? (
        <GenericImageGallery
          isCoverShown={isCoverShown}
          isGalleryImagesShown={true}
          coverImage={preview}
          galleryImages={galleryFiles}
          onSetPreviewImage={handleSetPreviewFile}
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
