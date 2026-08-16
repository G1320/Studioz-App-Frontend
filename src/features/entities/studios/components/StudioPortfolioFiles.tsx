import { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@shared/components';
import { RemoteAudioPlayer } from '@shared/components/audio';
import { MusicNoteIcon } from '@shared/components/icons';
import {
  useStudioFiles,
  useUploadStudioFileMutation,
  useDeleteStudioFileMutation,
  useUpdateStudioFileMutation,
  useUploadStudioCoverMutation,
  useExtractStudioCoverMutation
} from '@shared/hooks';
import { useHiFiAudioEngine } from '@shared/audio';
import {
  STUDIO_PORTFOLIO_ACCEPTED_FILE_TYPES,
  STUDIO_PORTFOLIO_MAX_FILE_SIZE_MB,
  STUDIO_PORTFOLIO_MAX_FILES,
  STUDIO_PORTFOLIO_ROLES,
  STUDIO_PORTFOLIO_COVER_TYPES,
  STUDIO_PORTFOLIO_COVER_MAX_FILE_SIZE_MB,
  type StudioPortfolioRole
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

type RoleFilter = 'all' | StudioPortfolioRole;

function displayTrackTitle(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ');
}

export const StudioPortfolioFiles: React.FC<StudioPortfolioFilesProps> = ({
  studioId,
  canManage = false
}) => {
  const { t } = useTranslation('forms');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [uploadRole, setUploadRole] = useState<StudioPortfolioRole | ''>('mixed');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const { files, isLoading, refetch } = useStudioFiles(studioId);
  const uploadMutation = useUploadStudioFileMutation();
  const deleteMutation = useDeleteStudioFileMutation();
  const updateMutation = useUpdateStudioFileMutation();
  const coverMutation = useUploadStudioCoverMutation();
  const extractCoverMutation = useExtractStudioCoverMutation();
  const { active, status } = useHiFiAudioEngine();

  const acceptedTypes = [...STUDIO_PORTFOLIO_ACCEPTED_FILE_TYPES];

  const roleLabel = (role?: string) => {
    if (!role) return t('form.portfolio.roles.uncategorized', { defaultValue: 'Uncategorized' });
    return t(`form.portfolio.roles.${role}`, { defaultValue: role });
  };

  const filteredFiles = useMemo(() => {
    if (roleFilter === 'all') return files;
    return files.filter((file) => file.role === roleFilter);
  }, [files, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts: Record<RoleFilter, number> = {
      all: files.length,
      mixed: 0,
      mastered: 0,
      recorded: 0,
      produced: 0
    };
    files.forEach((file) => {
      if (file.role && file.role in counts) {
        counts[file.role] += 1;
      }
    });
    return counts;
  }, [files]);

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
        role: uploadRole || undefined,
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
    [canManage, files.length, uploadRole]
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

  const handleCoverUpload = async (fileId: string, image: File) => {
    const ext = '.' + image.name.split('.').pop()?.toLowerCase();
    if (!(STUDIO_PORTFOLIO_COVER_TYPES as readonly string[]).includes(ext)) {
      alert(t('form.portfolio.invalidCoverType', { defaultValue: 'Use a JPG, PNG, or WebP cover.' }));
      return;
    }
    if (image.size > STUDIO_PORTFOLIO_COVER_MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(
        t('form.portfolio.coverTooLarge', {
          size: STUDIO_PORTFOLIO_COVER_MAX_FILE_SIZE_MB,
          defaultValue: `Cover is too large (max ${STUDIO_PORTFOLIO_COVER_MAX_FILE_SIZE_MB}MB).`
        })
      );
      return;
    }
    try {
      await coverMutation.mutateAsync({ studioId, fileId, file: image });
      refetch();
    } catch (error) {
      console.error('Failed to upload cover:', error);
    }
  };

  if (!canManage && !isLoading && files.length === 0) {
    return null;
  }

  return (
    <section className="studio-portfolio-view__listen">
      <div className="studio-portfolio-view__header">
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
        {files.length > 0 && (
          <div className="studio-portfolio-view__filters">
            <button
              type="button"
              className={`portfolio-filter-chip ${roleFilter === 'all' ? 'portfolio-filter-chip--active' : ''}`}
              onClick={() => setRoleFilter('all')}
            >
              {t('form.portfolio.filterAll', { defaultValue: 'All' })}
              <span className="portfolio-filter-chip__count">{roleCounts.all}</span>
            </button>
            {STUDIO_PORTFOLIO_ROLES.map((role) =>
              roleCounts[role] > 0 || canManage ? (
                <button
                  key={role}
                  type="button"
                  className={`portfolio-filter-chip ${roleFilter === role ? 'portfolio-filter-chip--active' : ''}`}
                  onClick={() => setRoleFilter(role)}
                >
                  {roleLabel(role)}
                  {roleCounts[role] > 0 && (
                    <span className="portfolio-filter-chip__count">{roleCounts[role]}</span>
                  )}
                </button>
              ) : null
            )}
          </div>
        )}
      </div>

      {canManage && (
        <div className="project-file-uploader">
          <label className="portfolio-track-tile__upload-role">
            <span>{t('form.portfolio.uploadRole', { defaultValue: 'Tag new uploads as' })}</span>
            <select
              value={uploadRole}
              onChange={(e) => setUploadRole((e.target.value || '') as StudioPortfolioRole | '')}
            >
              {STUDIO_PORTFOLIO_ROLES.map((role) => (
                <option key={role} value={role}>
                  {roleLabel(role)}
                </option>
              ))}
            </select>
          </label>
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
      ) : filteredFiles.length > 0 ? (
        <div className="studio-portfolio-view__grid">
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file: StudioFile) => {
              const isActive =
                active?.library === 'studio' &&
                active.containerId === studioId &&
                active.fileId === file._id &&
                (status === 'playing' || status === 'paused' || status === 'buffering');
              return (
                <motion.article
                  key={file._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`portfolio-card portfolio-track-tile${
                    isActive ? ' portfolio-track-tile--active' : ''
                  }`}
                >
                  <div className="portfolio-card__image-wrapper">
                    {file.coverUrl ? (
                      <img
                        src={file.coverUrl}
                        alt={displayTrackTitle(file.fileName)}
                        className="portfolio-card__image"
                      />
                    ) : (
                      <div className="portfolio-card__image-placeholder">
                        <MusicNoteIcon />
                      </div>
                    )}
                    <div className="portfolio-card__overlay" />
                    <div className="portfolio-card__type portfolio-card__type--audio">
                      <span>{roleLabel(file.role)}</span>
                    </div>
                    {isPlayableAudioExtension(file.fileName) && (
                      <div className="portfolio-track-tile__play">
                        <RemoteAudioPlayer
                          library="studio"
                          containerId={studioId}
                          file={file}
                          enableCues={false}
                          layout="compact"
                        />
                      </div>
                    )}
                  </div>
                  <div className="portfolio-card__meta">
                    <h3 className="portfolio-card__title" title={file.fileName}>
                      {displayTrackTitle(file.fileName)}
                    </h3>
                    {canManage && (
                      <div className="portfolio-track-tile__manage">
                        <select
                          aria-label={t('form.portfolio.yourRole', { defaultValue: 'Your Role' })}
                          value={file.role || ''}
                          onChange={(e) =>
                            updateMutation.mutate({
                              studioId,
                              fileId: file._id,
                              role: (e.target.value || '') as StudioPortfolioRole | ''
                            })
                          }
                        >
                          <option value="">
                            {t('form.portfolio.roles.uncategorized', { defaultValue: 'Uncategorized' })}
                          </option>
                          {STUDIO_PORTFOLIO_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {roleLabel(role)}
                            </option>
                          ))}
                        </select>
                        <label className="portfolio-track-tile__cover-btn">
                          {t('form.portfolio.uploadCover', { defaultValue: 'Cover' })}
                          <input
                            type="file"
                            accept={STUDIO_PORTFOLIO_COVER_TYPES.join(',')}
                            hidden
                            onChange={(e) => {
                              const image = e.target.files?.[0];
                              e.target.value = '';
                              if (image) void handleCoverUpload(file._id, image);
                            }}
                          />
                        </label>
                        <Button
                          className="button--secondary button--small"
                          onClick={() =>
                            extractCoverMutation.mutate({ studioId, fileId: file._id })
                          }
                          disabled={extractCoverMutation.isPending}
                        >
                          {t('form.portfolio.coverFromFile', { defaultValue: 'From file' })}
                        </Button>
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
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        canManage && (
          <p className="project-file-uploader__empty">
            {t('form.portfolio.noTracks', {
              defaultValue: 'No hosted tracks yet. Upload audio to play it on your public portfolio.'
            })}
          </p>
        )
      )}
    </section>
  );
};

export default StudioPortfolioFiles;
