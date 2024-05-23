import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { toast } from 'sonner';
import GenericImageGallery from '../imageGallery/genericImageGallery';
import GenericAudioGallery from '../audioGallery/genericAudioGallery';

const validMimeTypes = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
  'audio/aac': ['.aac'],
  'audio/mp4': ['.m4a'],
  'audio/x-ms-wma': ['.wma'],
};

const AudioUploader = ({ isCoverShown, onAudioUpload, multiple = true, audioFiles = null }) => {
  const [preview, setPreview] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const showErrorMessages = async (errors) => {
    for (const error of errors) {
      toast.error(error);
      await delay(700);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const newErrors = [];
      // Validate accepted files
      acceptedFiles.forEach((file) => {
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!Object.keys(validMimeTypes).includes(file.type)) {
          newErrors.push(`Skipped "${file.name}" because it is not a valid MIME type.`);
        }
        if (!validMimeTypes[file.type].includes(extension)) {
          newErrors.push(`Skipped "${file.name}" because an invalid file extension was provided.`);
        }
      });

      // Handle rejected files
      fileRejections.forEach((rejection) => {
        const { file, errors } = rejection;
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            newErrors.push(`Skipped "${file.name}" because it is larger than 9MB.`);
          } else if (error.code === 'file-invalid-type') {
            newErrors.push(`Skipped "${file.name}" because it is not a valid file type.`);
          } else {
            newErrors.push(`Skipped "${file.name}" because of unknown error: ${error.message}.`);
          }
        });
      });

      if (acceptedFiles.length > 0) {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setPreview(fileReader.result);
          onAudioUpload(acceptedFiles);
        };
        fileReader.readAsDataURL(acceptedFiles[0]);
      }

      showErrorMessages(newErrors);
    },
    [onAudioUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: 12,
    accept: validMimeTypes,
    maxSize: 9 * 1024 * 1024,
  });

  const handleSetPreviewImage = (image) => {
    setPreview(image);
  };

  return (
    <div>
      <div
        className={`file-uploader audio-uploader preview ${multiple ? 'multiple' : ''}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div>
          {isDragActive ? (
            <ArrowDropDownCircleIcon className="icon" />
          ) : (
            <small>
              {multiple ? 'Drop a few extra audio files here' : 'Drop your main audio file here'}
            </small>
          )}
          {preview ? (
            <audio src={preview} controls className=" gallery-audio-file " />
          ) : (
            <div className="preview">
              <UploadFileIcon className="icon" />
            </div>
          )}
        </div>
      </div>
      <GenericAudioGallery
        isCoverShown={isCoverShown}
        isAudioFilesShown={true}
        coverAudioFile={preview}
        audioFiles={audioFiles}
        className="audio-upload-audio-files-gallery"
        onSetPreviewAudioFile={handleSetPreviewImage}
      />
    </div>
  );
};

export default AudioUploader;
