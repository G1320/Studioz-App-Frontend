// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

// const ImageUploader = ({ onImageUpload, multiple = true }) => {
//   const [preview, setPreview] = useState(null);

//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       const file = new FileReader();
//       file.onloadend = () => {
//         setPreview(file.result);
//         onImageUpload(acceptedFiles);
//       };

//       file.readAsDataURL(acceptedFiles[0]);
//     },
//     [onImageUpload]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple,
//     maxFiles: 12,
//     accept: 'image/png',
//     // maxSize: 9 * 1024 * 1024,
//   });
//   return (
//     <div>
//       <div className="image-uploader preview" {...getRootProps()}>
//         <input {...getInputProps()} />
//         <div>
//           {isDragActive ? (
//             <ArrowDropDownCircleIcon className="icon" />
//           ) : (
//             <small>{multiple ? 'Drop a few gallery photos here' : 'Drop a cover photo here'}</small>
//           )}
//           {preview ? (
//             <img src={preview} alt="preview" />
//           ) : (
//             <div className="preview">
//               <UploadFileIcon className="icon" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

const validMimeTypes = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
};

const ImageUploader = ({ onImageUpload, multiple = true }) => {
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);

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
        const file = rejection.file;
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!Object.keys(validMimeTypes).includes(file.type)) {
          newErrors.push(`Skipped "${file.name}" because it is not a valid MIME type.`);
        }
        if (!validMimeTypes[file.type].includes(extension)) {
          newErrors.push(`Skipped "${file.name}" because an invalid file extension was provided.`);
        }
      });

      // Process first accepted file for preview
      if (acceptedFiles.length > 0 && newErrors.length === 0) {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setPreview(fileReader.result);
          onImageUpload(acceptedFiles);
        };
        fileReader.readAsDataURL(acceptedFiles[0]);
      }

      setErrors(newErrors);
      console.log('newErrors: ', newErrors);
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

  return (
    <div>
      <div className="image-uploader preview" {...getRootProps()}>
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
      {errors.length > 0 && (
        <div>
          <h3>Errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
