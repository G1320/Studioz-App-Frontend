import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components';
import { RemoteAudioPlayer } from '@shared/components/audio';
import {
  useStudioFiles,
  useUploadStudioFileMutation,
  useDeleteStudioFileMutation
} from '@shared/hooks';
import { formatFileSize } from '@shared/services';
import {
  STUDIO_PORTFOLIO_ACCEPTED_FILE_TYPES,
  STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB,
  STUDIO_PORTFOLIO_MAX_FILES
} from '@shared/constants/studioPortfolioFileLimits';
import { isPlayableAudioExtension } from '@shared/constants/remoteProjectFileLimits';
import { StudioFile } from 'src/types';
import '@features/entities/remote-projects/components/styles/_project-file-uploader.scss';

interface StudioPortfolioFilesProps {
  studioId: string;
  canManage?: boolean;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export const StudioPortfolioFiles: React.FC<StudioPortfolioFilesProps> = ({
  studioId,
  canManage = false
}) => {
  const { t } = useTranslation('forms');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const { files, isLoading, refetch } = useStudioFiles(studioId);
  const uploadMutation = useUploadStudioFileMutation();
  const deleteMutation = useDeleteStudioFileMutation();

  const acceptedTypes = [...STUDIO_PORTFOLIO_ACCEPTED_FILE_TYPES];

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension as (typeof STUDIO_PORTFOLIO_ACCEPTED_FILE_TYPES)[number])) {
      return t('form.portfolio.invalidFileType', { defaultValue: 'This file type is not supported.' });
    }
    if (file.size > STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB * 1024 * 1024) {
      return t('form.portfolio.fileTooLarge', {
        size: STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB,
        defaultValue: `File is too large (max ${STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB}MB).`
      });
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const tempId = `temp-${Date.now()}-${file.name}`;
    setUploads((prev) => [
      ...prev,
      { fileId: tempId, fileName: file.name, progress: 0, status: 'uploading' }
    ]);

    try {
      await uploadMutation.mutateAsync({
        studioId,
        file,
        onProgress: (progress) => {
          setUploads((prev) => prev.map((u) => (u.fileId === tempId ? { ...u, progress } : u)));
        }
      });
      setUploads((prev) =>
        prev.map((u) => (u.fileId === tempId ? { ...u, progress: 100, status: 'complete' } : u))
      );
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.fileId !== tempId));
      }, 2000);
      refetch();
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) =>
          u.fileId === tempId ? { ...u, status: 'error', error: (error as Error).message } : u
        )
      );
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const filesToUpload = Array.from(fileList);
    if (files.length + filesToUpload.length > STUDIO_PORTFOLIO_MAX_FILES) {
      alert(
        t('form.portfolio.maxFilesExceeded', {
          count: STUDIO_PORTFOLIO_MAX_FILES,
          defaultValue: `You can upload up to ${STUDIO_PORTFOLIO_MAX_FILES} files.`
        })
      );
      return;
    }

    for (const file of filesToUpload) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }
      void uploadFile(file);
    }
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (canManage) setIsDragging(true);
    },
    [canManage]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!canManage) return;
      const { files: dropped } = e.dataTransfer;
      if (dropped.length > 0) void handleFiles(dropped);
    },
    [canManage, files.length]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files: selected } = e.target;
    if (selected && selected.length > 0) void handleFiles(selected);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteFile = async (fileId: string) => {
    if (
      !confirm(
        t('form.portfolio.confirmDeleteFile', { defaultValue: 'Remove this track from your portfolio?' })
      )
    ) {
      return;
    }
    try {
      await deleteMutation.mutateAsync({ studioId, fileId });
      refetch();
    } catch (error) {
      console.error('Failed to delete portfolio file:', error);
    }
  };

  if (!canManage && !isLoading && files.length === 0) {
    return null;
  }

  return (
    <section className="studio-portfolio-view__listen">
      <div className="studio-portfolio-view__title-section">
        <h2 className="studio-portfolio-view__title">
          {t('form.portfolio.listenHere', { defaultValue: 'Listen here' })}
        </h2>
        <p className="studio-portfolio-view__subtitle">
          {t('form.portfolio.listenDesc', {
            defaultValue: 'Original mixes and masters from this studio, played in the browser.'
          })}
        </p>
      </div>

      <div className="project-file-uploader">
        {canManage && (
          <div
            className={`project-file-uploader__dropzone ${isDragging ? 'project-file-uploader__dropzone--dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="project-file-uploader__input"
              onChange={handleInputChange}
              accept={acceptedTypes.join(',')}
              multiple
            />
            <div className="project-file-uploader__dropzone-content">
              <p className="project-file-uploader__dropzone-text">
                {isDragging
                  ? t('form.portfolio.dropHere', { defaultValue: 'Drop files here' })
                  : t('form.portfolio.dragOrClick', {
                      defaultValue: 'Drag audio files here or click to upload'
                    })}
              </p>
              <p className="project-file-uploader__dropzone-hint">
                {acceptedTypes.join(', ')} · {STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB}MB ·{' '}
                {t('form.portfolio.maxFiles', {
                  count: STUDIO_PORTFOLIO_MAX_FILES,
                  defaultValue: `up to ${STUDIO_PORTFOLIO_MAX_FILES} tracks`
                })}
              </p>
            </div>
          </div>
        )}

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
                    {t('form.portfolio.uploadComplete', { defaultValue: 'Uploaded' })}
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

        {isLoading ? (
          <div className="project-file-uploader__loading">
            {t('form.portfolio.loadingTracks', { defaultValue: 'Loading tracks…' })}
          </div>
        ) : files.length > 0 ? (
          <ul className="project-file-uploader__file-list">
            {files.map((file: StudioFile) => (
              <li
                key={file._id}
                className={`project-file-uploader__file-item${
                  isPlayableAudioExtension(file.fileName)
                    ? ' project-file-uploader__file-item--with-player'
                    : ''
                }`}
              >
                <div className="project-file-uploader__file-header">
                  {isPlayableAudioExtension(file.fileName) && (
                    <RemoteAudioPlayer
                      library="studio"
                      containerId={studioId}
                      file={file}
                      enableCues={false}
                    />
                  )}
                  <div className="project-file-uploader__file-info">
                    <span className="project-file-uploader__file-name">{file.fileName}</span>
                    <span className="project-file-uploader__file-size">{formatFileSize(file.fileSize)}</span>
                  </div>
                  {canManage && (
                    <div className="project-file-uploader__file-actions">
                      <Button
                        className="button--danger button--small"
                        onClick={() => handleDeleteFile(file._id)}
                        disabled={deleteMutation.isPending}
                      >
                        {t('form.portfolio.removeTrack', { defaultValue: 'Remove' })}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          canManage && (
            <p className="project-file-uploader__empty">
              {t('form.portfolio.noTracks', {
                defaultValue: 'No hosted tracks yet. Upload audio to play it on your public portfolio.'
              })}
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default StudioPortfolioFiles;
