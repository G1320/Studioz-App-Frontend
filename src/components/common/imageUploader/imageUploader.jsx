import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { toast } from 'sonner';
import GenericImageGallery from '../imageGallery/genericImageGallery';

const validMimeTypes = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
};

const ImageUploader = ({ isCoverShown, onImageUpload, multiple = true, galleryImages = null }) => {
  const [preview, setPreview] = useState(null);

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
            newErrors.push(`Skipped "${file.name}" because it is not a valid MIME type.`);
          } else {
            newErrors.push(`Skipped "${file.name}" because of unknown error: ${error.message}.`);
          }
        });
      });

      if (acceptedFiles.length > 0) {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setPreview(fileReader.result);
          onImageUpload(acceptedFiles);
        };
        fileReader.readAsDataURL(acceptedFiles[0]);
      }
      newErrors.forEach((error) => toast.error(error));
    },
    [onImageUpload]
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
      <div className={`image-uploader preview ${multiple ? 'multiple' : ''}`} {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          {isDragActive ? (
            <ArrowDropDownCircleIcon className="icon" />
          ) : (
            <small>{multiple ? 'Drop a few gallery photos here' : 'Drop a cover photo here'}</small>
          )}
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <div className="preview">
              <UploadFileIcon className="icon" />
            </div>
          )}
        </div>
      </div>
      <GenericImageGallery
        isCoverShown={isCoverShown}
        isGalleryImagesShown={true}
        coverImage={preview}
        galleryImages={galleryImages}
        className="image-upload-image-gallery"
        onSetPreviewImage={handleSetPreviewImage}
      />
    </div>
  );
};

export default ImageUploader;
