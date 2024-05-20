import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import UploadFileIcon from '@mui/icons-material/UploadFile';

const ImageUploader = ({ onImageUpload, multiple = true }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = new FileReader();
      file.onloadend = () => {
        setPreview(file.result);
        onImageUpload(acceptedFiles);
      };

      file.readAsDataURL(acceptedFiles[0]);
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>
            <p>Drop the files here ...</p>
          </div>
        ) : (
          <div>
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
        {preview ? (
          <div className="preview">
            <img className="preview" src={preview} alt="preview" />{' '}
          </div>
        ) : (
          <div className="preview">
            <UploadFileIcon className="icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
