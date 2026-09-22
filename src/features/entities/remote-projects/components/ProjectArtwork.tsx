import { useCallback, useEffect, useState } from 'react';
import { ImagePlus, Images, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRemoveProjectArtworkMutation, useUploadProjectArtworkMutation } from '@shared/hooks';
import './styles/_project-artwork.scss';

const MAX_ARTWORK_SIZE = 8 * 1024 * 1024;
const ACCEPTED_ARTWORK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProjectArtworkProps {
  projectId: string;
  artworkUrl?: string;
  canEdit: boolean;
}

export const ProjectArtwork: React.FC<ProjectArtworkProps> = ({ projectId, artworkUrl, canEdit }) => {
  const { t } = useTranslation('remoteProjects');
  const uploadMutation = useUploadProjectArtworkMutation();
  const removeMutation = useRemoveProjectArtworkMutation();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!ACCEPTED_ARTWORK_TYPES.includes(file.type)) {
        toast.error(t('artwork.invalidType'));
        return;
      }
      if (file.size > MAX_ARTWORK_SIZE) {
        toast.error(t('artwork.tooLarge'));
        return;
      }

      const nextPreview = URL.createObjectURL(file);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextPreview;
      });
      setProgress(0);

      try {
        await uploadMutation.mutateAsync({
          projectId,
          file,
          onProgress: setProgress
        });
      } catch (error) {
        URL.revokeObjectURL(nextPreview);
        setPreviewUrl(undefined);
        console.error('Failed to upload project artwork:', error);
      }
    },
    [projectId, t, uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: MAX_ARTWORK_SIZE,
    disabled: !canEdit || uploadMutation.isPending || removeMutation.isPending,
    noClick: true,
    noKeyboard: true
  });

  const handleRemove = async () => {
    if (!confirm(t('artwork.confirmRemove'))) return;
    try {
      await removeMutation.mutateAsync(projectId);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return undefined;
      });
    } catch (error) {
      console.error('Failed to remove project artwork:', error);
    }
  };

  const displayUrl = previewUrl || artworkUrl;
  const isPending = uploadMutation.isPending || removeMutation.isPending;

  return (
    <section className={`project-artwork${isDragActive ? ' project-artwork--dragging' : ''}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="project-artwork__visual">
        {displayUrl ? (
          <img src={displayUrl} alt={t('artwork.alt')} className="project-artwork__image" />
        ) : (
          <div className="project-artwork__placeholder">
            <Images aria-hidden="true" />
            <span>{t('artwork.empty')}</span>
          </div>
        )}
        {uploadMutation.isPending && (
          <div className="project-artwork__progress" role="status">
            <span>{t('artwork.uploading', { progress })}</span>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="project-artwork__actions">
          <label className={`project-artwork__button${isPending ? ' project-artwork__button--disabled' : ''}`}>
            <ImagePlus aria-hidden="true" />
            {displayUrl ? t('artwork.replace') : t('artwork.add')}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              disabled={isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onDrop([file]);
                event.target.value = '';
              }}
            />
          </label>
          {displayUrl && (
            <button
              type="button"
              className="project-artwork__button project-artwork__button--danger"
              onClick={handleRemove}
              disabled={isPending}
            >
              <Trash2 aria-hidden="true" />
              {t('artwork.remove')}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
