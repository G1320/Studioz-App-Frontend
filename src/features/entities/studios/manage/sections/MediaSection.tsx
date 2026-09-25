import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '@shared/components/fileUploader';
import { useStudioFileUpload } from '@shared/hooks';
import { Studio } from 'src/types/index';
import { useStudioSectionSave } from '../useStudioSectionSave';

interface MediaSectionProps {
  studio: Studio;
}

export const MediaSection = ({ studio }: MediaSectionProps) => {
  const { t } = useTranslation(['forms', 'common']);
  const [galleryImages, setGalleryImages] = useState<string[]>(studio.galleryImages || []);
  const [coverImage, setCoverImage] = useState(studio.coverImage || '');
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>(studio.galleryAudioFiles || []);
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);
  const { handleFileUpload } = useStudioFileUpload({ setGalleryImages, setGalleryAudioFiles });

  useEffect(() => {
    setGalleryImages(studio.galleryImages || []);
    setCoverImage(studio.coverImage || studio.galleryImages?.[0] || '');
    setGalleryAudioFiles(studio.galleryAudioFiles || []);
  }, [studio._id, studio.galleryImages, studio.coverImage, studio.galleryAudioFiles]);

  const baselineImages = studio.galleryImages || [];
  const baselineCover = studio.coverImage || baselineImages[0] || '';
  const baselineAudio = studio.galleryAudioFiles || [];

  const isDirty =
    JSON.stringify(galleryImages) !== JSON.stringify(baselineImages) ||
    coverImage !== baselineCover ||
    JSON.stringify(galleryAudioFiles) !== JSON.stringify(baselineAudio);

  const handleRemoveImage = (image: string) => {
    setGalleryImages((prev) => {
      const next = prev.filter((url) => url !== image);
      if (coverImage === image) {
        setCoverImage(next[0] || '');
      }
      return next;
    });
  };

  const handleDiscard = () => {
    setGalleryImages(baselineImages);
    setCoverImage(baselineCover);
    setGalleryAudioFiles(baselineAudio);
  };

  const handleSave = () => {
    const nextCover = coverImage || galleryImages[0] || '';
    savePatch({
      galleryImages,
      coverImage: nextCover,
      galleryAudioFiles,
      coverAudioFile: galleryAudioFiles[0] || studio.coverAudioFile || ''
    });
  };

  return (
    <div className="studio-manage-section">
      <header className="studio-manage-section__header">
        <div>
          <h2 className="studio-manage-section__title">
            {t('manage.sections.media', 'Media')}
          </h2>
          <p className="studio-manage-section__subtitle">
            {t('manage.media.subtitle', 'Photos and audio that appear on your public listing.')}
          </p>
        </div>
        <div className="studio-manage-section__actions">
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--ghost"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
          >
            {t('common:buttons.discard', 'Discard')}
          </button>
          <button
            type="button"
            className="studio-manage-btn studio-manage-btn--primary"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving
              ? t('common:buttons.saving', 'Saving…')
              : t('common:buttons.save', 'Save')}
          </button>
        </div>
      </header>

      <FileUploader
        fileType="image"
        onFileUpload={async (files, type) => {
          await handleFileUpload(files, type);
        }}
        galleryFiles={galleryImages}
        isCoverShown={true}
        onRemoveImage={handleRemoveImage}
        onReorderImages={(files) => {
          setGalleryImages(files);
          if (files.length && !files.includes(coverImage)) {
            setCoverImage(files[0]);
          }
        }}
      />
    </div>
  );
};
