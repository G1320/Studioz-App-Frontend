import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Download, Loader2, Lock, Plus, Trash2 } from 'lucide-react';
import { RemoteAudioPlayer } from '@shared/components/audio';
import { useTranslation } from 'react-i18next';
import { useUploadFileMutation, useDeleteFileMutation } from '@shared/hooks';
import { useProjectFiles } from '@shared/hooks';
import { useAudioCueComment } from '@shared/audio';
import { formatFileSize, getDownloadUrl } from '@shared/services';
import { ProjectFileType, ProjectFile } from 'src/types/index';
import {
  REMOTE_PROJECT_ACCEPTED_FILE_TYPES,
  REMOTE_PROJECT_MAX_FILE_SIZE_MB,
  REMOTE_PROJECT_MAX_FILES_PER_PROJECT,
  isPlayableAudioExtension
} from '@shared/constants/remoteProjectFileLimits';
import { TrackCommentThread } from './TrackCommentThread';
import './styles/_project-file-uploader.scss';

export interface ProjectFileUploaderHandle {
  acceptFiles: (fileList: FileList | File[]) => void;
  openFilePicker: () => void;
  canUpload: boolean;
  fileType: ProjectFileType;
}

interface ProjectFileUploaderProps {
  projectId: string;
  fileType: ProjectFileType;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  downloadsLocked?: boolean;
  currentUserId?: string;
  canComment?: boolean;
  canResolve?: boolean;
  /** Project artwork shown in the sticky bottom player. */
  artworkUrl?: string;
  /** Project title shown above the track name in the sticky player. */
  contextLabel?: string;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export const ProjectFileUploader = forwardRef<ProjectFileUploaderHandle, ProjectFileUploaderProps>(
  function ProjectFileUploader(
    {
      projectId,
      fileType,
      acceptedTypes = [...REMOTE_PROJECT_ACCEPTED_FILE_TYPES],
      maxFileSize = REMOTE_PROJECT_MAX_FILE_SIZE_MB,
      maxFiles = REMOTE_PROJECT_MAX_FILES_PER_PROJECT,
      disabled = false,
      downloadsLocked = false,
      currentUserId,
      canComment = false,
      canResolve = false,
      artworkUrl,
      contextLabel
    },
    ref
  ) {
    const { t } = useTranslation('remoteProjects');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploads, setUploads] = useState<UploadProgress[]>([]);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    const { files, isLoading, refetch } = useProjectFiles({ projectId, type: fileType });
    const uploadMutation = useUploadFileMutation();
    const deleteMutation = useDeleteFileMutation();
    const cueComment = useAudioCueComment();

    const validateFile = useCallback(
      (file: File): string | null => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedTypes.includes(extension)) {
          return t('invalidFileType');
        }
        if (file.size > maxFileSize * 1024 * 1024) {
          return t('fileTooLarge', { size: maxFileSize });
        }
        return null;
      },
      [acceptedTypes, maxFileSize, t]
    );

    const uploadFile = useCallback(
      async (file: File) => {
        const tempId = `temp-${Date.now()}-${file.name}`;
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
      },
      [uploadMutation, projectId, fileType, refetch]
    );

    const handleFiles = useCallback(
      (fileList: FileList | File[]) => {
        if (disabled) return;
        const filesToUpload = Array.from(fileList);

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
          void uploadFile(file);
        }
      },
      [disabled, files.length, maxFiles, t, validateFile, uploadFile]
    );

    const openFilePicker = useCallback(() => {
      if (!disabled) fileInputRef.current?.click();
    }, [disabled]);

    useImperativeHandle(
      ref,
      () => ({
        acceptFiles: handleFiles,
        openFilePicker,
        canUpload: !disabled,
        fileType
      }),
      [handleFiles, openFilePicker, disabled, fileType]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files: selected } = e.target;
      if (selected && selected.length > 0) {
        handleFiles(selected);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleDeleteFile = async (fileId: string) => {
      if (!confirm(t('confirmDelete'))) return;
      try {
        await deleteMutation.mutateAsync({ projectId, fileId });
        refetch();
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    };

    const downloadFileAsBlob = async (file: ProjectFile) => {
      const { downloadUrl } = await getDownloadUrl(projectId, file._id);
      const res = await fetch(downloadUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    };

    const handleDownloadFile = async (file: ProjectFile) => {
      if (downloadsLocked) return;
      try {
        await downloadFileAsBlob(file);
      } catch (error) {
        console.error('Failed to download file:', error);
        alert(t('downloadFailed'));
      }
    };

    const handleDownloadAll = async () => {
      if (files.length === 0 || downloadsLocked) return;
      setIsDownloadingAll(true);
      try {
        for (let i = 0; i < files.length; i++) {
          await downloadFileAsBlob(files[i]);
          if (i < files.length - 1) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      } catch (error) {
        console.error('Failed to download files:', error);
        alert(t('downloadFailed'));
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

    const showThreads = !!currentUserId;

    return (
      <div className={`project-file-uploader project-file-uploader--${fileType}`}>
        <div className="project-file-uploader__header">
          <div className="project-file-uploader__heading">
            <h3 className="project-file-uploader__title">{fileTypeLabel}</h3>
            <span className="project-file-uploader__count">
              {files.length > 0 ? t('fileCount', { count: files.length }) : t('noFiles')}
            </span>
          </div>

          <div className="project-file-uploader__header-actions">
            {files.length > 1 && (
              <>
                <button
                  type="button"
                  className="project-icon-action project-icon-action--round project-icon-action--download"
                  onClick={handleDownloadAll}
                  disabled={isDownloadingAll || downloadsLocked}
                  aria-label={
                    downloadsLocked
                      ? t('downloadLock.locked')
                      : isDownloadingAll
                        ? t('common.processing')
                        : t('downloadAll')
                  }
                  title={downloadsLocked ? t('downloadLock.locked') : t('downloadAll')}
                >
                  {isDownloadingAll ? (
                    <Loader2 className="project-icon-action__spin" aria-hidden />
                  ) : downloadsLocked ? (
                    <Lock aria-hidden />
                  ) : (
                    <Download aria-hidden />
                  )}
                </button>
                {!disabled && (
                  <button
                    type="button"
                    className="project-icon-action project-icon-action--round project-icon-action--danger"
                    onClick={handleDeleteAll}
                    disabled={isDeletingAll || deleteMutation.isPending}
                    aria-label={isDeletingAll ? t('common.processing') : t('deleteAll')}
                    title={t('deleteAll')}
                  >
                    {isDeletingAll ? (
                      <Loader2 className="project-icon-action__spin" aria-hidden />
                    ) : (
                      <Trash2 aria-hidden />
                    )}
                  </button>
                )}
              </>
            )}

            {!disabled && (
              <button
                type="button"
                className="project-file-uploader__add"
                onClick={openFilePicker}
                aria-label={t('addFiles')}
                title={t('addFiles')}
              >
                <Plus aria-hidden />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="project-file-uploader__input"
            onChange={handleInputChange}
            accept={acceptedTypes.join(',')}
            multiple
            disabled={disabled}
            tabIndex={-1}
            aria-hidden
          />
        </div>

        {downloadsLocked && files.length > 0 && (
          <div className="project-file-uploader__locked-banner" role="status">
            <Lock size={14} aria-hidden />
            <span>{t('downloadLock.customerBanner')}</span>
          </div>
        )}

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

        {isLoading ? (
          <div className="project-file-uploader__loading">{t('common.loading')}</div>
        ) : files.length > 0 ? (
          <ul className="project-file-uploader__file-list">
            {files.map((file: ProjectFile, index: number) => {
              const playable = isPlayableAudioExtension(file.fileName);
              const threadOpen = showThreads && playable && cueComment?.openThreadFileId === file._id;
              const displayName = file.fileName.replace(/\.[^/.]+$/, '') || file.fileName;
              return (
                <li
                  key={file._id}
                  className={`project-file-uploader__file-item${
                    playable ? ' project-file-uploader__file-item--with-player' : ''
                  }${threadOpen ? ' project-file-uploader__file-item--active' : ''}`}
                >
                  <div className="project-file-uploader__file-row">
                    <span className="project-file-uploader__file-index" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div className="project-file-uploader__file-info">
                      <span className="project-file-uploader__file-name" title={file.fileName}>
                        {displayName}
                      </span>
                    </div>
                    <div className="project-file-uploader__file-meta">
                      {typeof file.revisionNumber === 'number' && file.revisionNumber > 0 && (
                        <span className="project-file-uploader__file-version">v{file.revisionNumber}</span>
                      )}
                      <span className="project-file-uploader__file-size">{formatFileSize(file.fileSize)}</span>
                    </div>
                    <div className="project-file-uploader__file-actions">
                      <button
                        type="button"
                        className="project-icon-action project-icon-action--round project-icon-action--download"
                        onClick={() => handleDownloadFile(file)}
                        disabled={downloadsLocked}
                        aria-label={downloadsLocked ? t('downloadLock.locked') : t('download')}
                        title={downloadsLocked ? t('downloadLock.locked') : t('download')}
                      >
                        {downloadsLocked ? <Lock aria-hidden /> : <Download aria-hidden />}
                      </button>
                      {!disabled ? (
                        <button
                          type="button"
                          className="project-icon-action project-icon-action--round project-icon-action--danger"
                          onClick={() => handleDeleteFile(file._id)}
                          disabled={deleteMutation.isPending}
                          aria-label={t('delete')}
                          title={t('delete')}
                        >
                          <Trash2 aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {playable && (
                    <div className="project-file-uploader__player">
                      <RemoteAudioPlayer
                        library="project"
                        containerId={projectId}
                        file={file}
                        onDownload={downloadsLocked ? undefined : () => handleDownloadFile(file)}
                        showThreadToggle={showThreads}
                        artworkUrl={artworkUrl}
                        contextLabel={contextLabel}
                      />
                    </div>
                  )}
                  {threadOpen && currentUserId && (
                    <TrackCommentThread
                      projectId={projectId}
                      file={file}
                      currentUserId={currentUserId}
                      canComment={canComment}
                      canResolve={canResolve}
                      artworkUrl={artworkUrl}
                      contextLabel={contextLabel}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          !disabled && (
            <p className="project-file-uploader__empty-hint">
              {t('dropAnywhereHint')}
            </p>
          )
        )}
      </div>
    );
  }
);

export default ProjectFileUploader;
