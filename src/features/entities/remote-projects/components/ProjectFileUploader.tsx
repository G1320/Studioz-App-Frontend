import { useState, useCallback, useRef } from 'react';
import { Button } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useUploadFileMutation, useDeleteFileMutation } from '@shared/hooks';
import { useProjectFiles } from '@shared/hooks';
import { formatFileSize } from '@shared/services';
import { ProjectFileType, ProjectFile } from 'src/types/index';
import './styles/_project-file-uploader.scss';

interface ProjectFileUploaderProps {
  projectId: string;
  fileType: ProjectFileType;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export const ProjectFileUploader: React.FC<ProjectFileUploaderProps> = ({
  projectId,
  fileType,
  acceptedTypes = ['.wav', '.aif', '.aiff', '.mp3', '.flac', '.zip'],
  maxFileSize = 500,
  maxFiles = 50,
  disabled = false,
}) => {
  const { t } = useTranslation('common');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const { files, isLoading, refetch } = useProjectFiles({ projectId, type: fileType });
  const uploadMutation = useUploadFileMutation();
  const deleteMutation = useDeleteFileMutation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return t('remoteProjects.invalidFileType', 'Invalid file type');
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return t('remoteProjects.fileTooLarge', `File exceeds ${maxFileSize}MB limit`);
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const tempId = `temp-${Date.now()}-${file.name}`;

    // Add to upload progress
    setUploads((prev) => [
      ...prev,
      { fileId: tempId, fileName: file.name, progress: 0, status: 'uploading' },
    ]);

    try {
      await uploadMutation.mutateAsync({
        projectId,
        file,
        type: fileType,
        onProgress: (progress) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === tempId ? { ...u, progress } : u
            )
          );
        },
      });

      // Mark as complete
      setUploads((prev) =>
        prev.map((u) =>
          u.fileId === tempId ? { ...u, progress: 100, status: 'complete' } : u
        )
      );

      // Remove from progress after delay
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.fileId !== tempId));
      }, 2000);

      // Refetch files list
      refetch();
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) =>
          u.fileId === tempId
            ? { ...u, status: 'error', error: (error as Error).message }
            : u
        )
      );
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const filesToUpload = Array.from(fileList);

    // Check max files limit
    if (files.length + filesToUpload.length > maxFiles) {
      alert(t('remoteProjects.maxFilesExceeded', `Maximum ${maxFiles} files allowed`));
      return;
    }

    for (const file of filesToUpload) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }
      uploadFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const { files } = e.dataTransfer;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm(t('remoteProjects.confirmDelete', 'Are you sure you want to delete this file?'))) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ projectId, fileId });
      refetch();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const fileTypeLabel = {
    source: t('remoteProjects.sourceFiles', 'Source Files'),
    deliverable: t('remoteProjects.deliverables', 'Deliverables'),
    revision: t('remoteProjects.revisions', 'Revisions'),
  }[fileType];

  return (
    <div className="project-file-uploader">
      <h3 className="project-file-uploader__title">{fileTypeLabel}</h3>

      {/* Drop zone */}
      <div
        className={`project-file-uploader__dropzone ${isDragging ? 'project-file-uploader__dropzone--dragging' : ''} ${disabled ? 'project-file-uploader__dropzone--disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="project-file-uploader__input"
          onChange={handleInputChange}
          accept={acceptedTypes.join(',')}
          multiple
          disabled={disabled}
        />
        <div className="project-file-uploader__dropzone-content">
          <p className="project-file-uploader__dropzone-text">
            {isDragging
              ? t('remoteProjects.dropHere', 'Drop files here')
              : t('remoteProjects.dragOrClick', 'Drag files here or click to browse')}
          </p>
          <p className="project-file-uploader__dropzone-hint">
            {t('remoteProjects.acceptedFormats', 'Accepted formats')}: {acceptedTypes.join(', ')}
            <br />
            {t('remoteProjects.maxSize', 'Max size')}: {maxFileSize}MB
          </p>
        </div>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="project-file-uploader__progress-list">
          {uploads.map((upload) => (
            <div key={upload.fileId} className="project-file-uploader__progress-item">
              <span className="project-file-uploader__progress-name">{upload.fileName}</span>
              {upload.status === 'uploading' && (
                <div className="project-file-uploader__progress-bar">
                  <div
                    className="project-file-uploader__progress-fill"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
              {upload.status === 'complete' && (
                <span className="project-file-uploader__progress-status project-file-uploader__progress-status--complete">
                  {t('remoteProjects.uploadComplete', 'Complete')}
                </span>
              )}
              {upload.status === 'error' && (
                <span className="project-file-uploader__progress-status project-file-uploader__progress-status--error">
                  {upload.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Files list */}
      {isLoading ? (
        <div className="project-file-uploader__loading">
          {t('common.loading', 'Loading...')}
        </div>
      ) : files.length > 0 ? (
        <ul className="project-file-uploader__file-list">
          {files.map((file: ProjectFile) => (
            <li key={file._id} className="project-file-uploader__file-item">
              <div className="project-file-uploader__file-info">
                <span className="project-file-uploader__file-name">{file.fileName}</span>
                <span className="project-file-uploader__file-size">
                  {formatFileSize(file.fileSize)}
                </span>
              </div>
              <div className="project-file-uploader__file-actions">
                <Button
                  className="button--secondary button--small"
                  onClick={() => {
                    // Download will be handled by getting download URL
                    window.open(
                      `/api/remote-projects/${projectId}/files/${file._id}/download`,
                      '_blank'
                    );
                  }}
                >
                  {t('remoteProjects.download', 'Download')}
                </Button>
                {!disabled && (
                  <Button
                    className="button--danger button--small"
                    onClick={() => handleDeleteFile(file._id)}
                    disabled={deleteMutation.isPending}
                  >
                    {t('remoteProjects.delete', 'Delete')}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="project-file-uploader__empty">
          {t('remoteProjects.noFiles', 'No files uploaded yet')}
        </p>
      )}
    </div>
  );
};

export default ProjectFileUploader;
