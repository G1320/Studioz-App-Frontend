import { useState, useCallback, useRef } from 'react';
import { Button } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useUploadFileMutation, useDeleteFileMutation } from '@shared/hooks';
import { useProjectFiles } from '@shared/hooks';
import { formatFileSize, getDownloadUrl } from '@shared/services';
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
  disabled = false
}) => {
  const { t } = useTranslation('remoteProjects');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const { files, isLoading, refetch } = useProjectFiles({ projectId, type: fileType });
  const uploadMutation = useUploadFileMutation();
  const deleteMutation = useDeleteFileMutation();

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return t('invalidFileType');
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return t('fileTooLarge', { size: maxFileSize });
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const tempId = `temp-${Date.now()}-${file.name}`;

    // Add to upload progress
    setUploads((prev) => [...prev, { fileId: tempId, fileName: file.name, progress: 0, status: 'uploading' }]);

    try {
      await uploadMutation.mutateAsync({
        projectId,
        file,
        type: fileType,
        onProgress: (progress) => {
          setUploads((prev) => prev.map((u) => (u.fileId === tempId ? { ...u, progress } : u)));
        }
      });

      // Mark as complete
      setUploads((prev) => prev.map((u) => (u.fileId === tempId ? { ...u, progress: 100, status: 'complete' } : u)));

      // Remove from progress after delay
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.fileId !== tempId));
      }, 2000);

      // Refetch files list
      refetch();
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) => (u.fileId === tempId ? { ...u, status: 'error', error: (error as Error).message } : u))
      );
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const filesToUpload = Array.from(fileList);

    // Check max files limit
    if (files.length + filesToUpload.length > maxFiles) {
      alert(t('maxFilesExceeded', { count: maxFiles }));
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
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ projectId, fileId });
      refetch();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleDownloadFile = async (file: ProjectFile) => {
    try {
      const response = await getDownloadUrl(projectId, file._id);
      window.open(response.downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to get download URL:', error);
      alert('Failed to download file');
    }
  };

  const handleDownloadAll = async () => {
    if (files.length === 0) return;
    setIsDownloadingAll(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await getDownloadUrl(projectId, file._id);
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.setAttribute('download', file.fileName);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (i < files.length - 1) {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    } catch (error) {
      console.error('Failed to download files:', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleDeleteAll = async () => {
    if (files.length === 0) return;
    if (!confirm(t('confirmDeleteAll', { count: files.length }))) return;
    setIsDeletingAll(true);
    try {
      for (const file of files) {
        await deleteMutation.mutateAsync({ projectId, fileId: file._id });
      }
      refetch();
    } catch (error) {
      console.error('Failed to delete files:', error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const fileTypeLabel = {
    source: t('sourceFiles'),
    deliverable: t('deliverables'),
    revision: t('revisionFiles')
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
          <p className="project-file-uploader__dropzone-text">{isDragging ? t('dropHere') : t('dragOrClick')}</p>
          <p className="project-file-uploader__dropzone-hint">
            {t('acceptedFormats')}: {acceptedTypes.join(', ')}
            <br />
            {t('maxSize')}: {maxFileSize}MB
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
                  <div className="project-file-uploader__progress-fill" style={{ width: `${upload.progress}%` }} />
                </div>
              )}
              {upload.status === 'complete' && (
                <span className="project-file-uploader__progress-status project-file-uploader__progress-status--complete">
                  {t('uploadComplete')}
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
        <div className="project-file-uploader__loading">{t('common.loading')}</div>
      ) : files.length > 0 ? (
        <>
          <div className="project-file-uploader__toolbar">
            <Button
              className="button--secondary button--small"
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
            >
              {isDownloadingAll ? t('common.processing') : t('downloadAll')}
            </Button>
            {!disabled && (
              <Button
                className="button--danger button--small"
                onClick={handleDeleteAll}
                disabled={isDeletingAll || deleteMutation.isPending}
              >
                {isDeletingAll ? t('common.processing') : t('deleteAll')}
              </Button>
            )}
          </div>
          <ul className="project-file-uploader__file-list">
          {files.map((file: ProjectFile) => (
            <li key={file._id} className="project-file-uploader__file-item">
              <div className="project-file-uploader__file-info">
                <span className="project-file-uploader__file-name">{file.fileName}</span>
                <span className="project-file-uploader__file-size">{formatFileSize(file.fileSize)}</span>
              </div>
              <div className="project-file-uploader__file-actions">
                <Button
                  className="button--secondary button--small"
                  onClick={() => handleDownloadFile(file)}
                >
                  {t('download')}
                </Button>
                {!disabled && (
                  <Button
                    className="button--danger button--small"
                    onClick={() => handleDeleteFile(file._id)}
                    disabled={deleteMutation.isPending}
                  >
                    {t('delete')}
                  </Button>
                )}
              </div>
            </li>
          ))}
          </ul>
        </>
      ) : (
        <p className="project-file-uploader__empty">{t('noFiles')}</p>
      )}
    </div>
  );
};

export default ProjectFileUploader;
