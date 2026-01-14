import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem, SocialLinks } from 'src/types/studio';

import {
  AddIcon,
  DeleteIcon,
  MusicNoteIcon,
  MicIcon,
  VideocamIcon,
  LinkIcon,
  CloseIcon,
  PlayIcon,
  AlbumIcon,
  YouTubeIcon,
  InstagramIcon,
  LanguageIcon
} from '@shared/components/icons';

import './styles/_portfolio-step.scss';

interface PortfolioStepProps {
  portfolio: PortfolioItem[];
  onPortfolioChange: (portfolio: PortfolioItem[]) => void;
  socialLinks: SocialLinks;
  onSocialLinksChange: (links: SocialLinks) => void;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: PortfolioItem) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { t, i18n } = useTranslation('forms');
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    type: 'audio',
    coverUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.link) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        artist: formData.artist || '',
        type: formData.type as 'audio' | 'video' | 'album',
        coverUrl: formData.coverUrl,
        link: formData.link,
        role: formData.role
      });
      setFormData({ type: 'audio', coverUrl: '' });
      onClose();
    }
  };

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="portfolio-modal"
        onClick={(e) => e.stopPropagation()}
        dir={i18n.dir()}
      >
        <div className="portfolio-modal__header">
          <h3 className="portfolio-modal__title">
            {t('form.portfolio.addProject', { defaultValue: 'Add Project' })}
          </h3>
          <button onClick={onClose} className="portfolio-modal__close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="portfolio-modal__form">
          {/* Type Selection */}
          <div className="portfolio-modal__type-grid">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'audio' })}
              className={`portfolio-modal__type-btn ${formData.type === 'audio' ? 'portfolio-modal__type-btn--active' : ''}`}
            >
              <MusicNoteIcon /> {t('form.portfolio.audio', { defaultValue: 'Audio' })}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'video' })}
              className={`portfolio-modal__type-btn ${formData.type === 'video' ? 'portfolio-modal__type-btn--active' : ''}`}
            >
              <VideocamIcon /> {t('form.portfolio.video', { defaultValue: 'Video' })}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'album' })}
              className={`portfolio-modal__type-btn ${formData.type === 'album' ? 'portfolio-modal__type-btn--active' : ''}`}
            >
              <AlbumIcon /> {t('form.portfolio.album', { defaultValue: 'Album' })}
            </button>
          </div>

          <div className="portfolio-modal__fields">
            <div className="portfolio-modal__field">
              <label>{t('form.portfolio.trackTitle', { defaultValue: 'Track / Album Title' })}</label>
              <input
                required
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('form.portfolio.trackTitlePlaceholder', { defaultValue: 'e.g. Summer Hits 2024' })}
              />
            </div>

            <div className="portfolio-modal__row">
              <div className="portfolio-modal__field">
                <label>{t('form.portfolio.artistName', { defaultValue: 'Artist Name' })}</label>
                <input
                  type="text"
                  value={formData.artist || ''}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder={t('form.portfolio.artistPlaceholder', { defaultValue: 'e.g. The Weeknd' })}
                />
              </div>
              <div className="portfolio-modal__field">
                <label>{t('form.portfolio.yourRole', { defaultValue: 'Your Role' })}</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder={t('form.portfolio.rolePlaceholder', { defaultValue: 'e.g. Mixing, Mastering' })}
                />
              </div>
            </div>

            <div className="portfolio-modal__field">
              <label>{t('form.portfolio.link', { defaultValue: 'Link (Spotify / YouTube / SoundCloud)' })}</label>
              <input
                required
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="portfolio-modal__field">
              <label>{t('form.portfolio.coverUrl', { defaultValue: 'Cover Image URL (optional)' })}</label>
              <input
                type="url"
                value={formData.coverUrl || ''}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="portfolio-modal__actions">
            <button type="button" onClick={onClose} className="portfolio-modal__cancel-btn">
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button type="submit" className="portfolio-modal__submit-btn">
              {t('form.portfolio.addProject', { defaultValue: 'Add Project' })}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const PortfolioStep: React.FC<PortfolioStepProps> = ({
  portfolio,
  onPortfolioChange,
  socialLinks,
  onSocialLinksChange
}) => {
  const { t, i18n } = useTranslation('forms');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    onPortfolioChange(portfolio.filter((item) => item.id !== id));
  };

  const handleAdd = (item: PortfolioItem) => {
    onPortfolioChange([...portfolio, item]);
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    onSocialLinksChange({ ...socialLinks, [field]: value });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideocamIcon />;
      case 'album':
        return <AlbumIcon />;
      default:
        return <MusicNoteIcon />;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'video':
        return 'portfolio-item__type--video';
      case 'album':
        return 'portfolio-item__type--album';
      default:
        return 'portfolio-item__type--audio';
    }
  };

  return (
    <div className="portfolio-step" dir={i18n.dir()}>
      {/* Social Links Section */}
      <section className="portfolio-step__section">
        <h3 className="portfolio-step__section-title">
          <LinkIcon className="portfolio-step__section-icon" />
          {t('form.portfolio.socialProfiles', { defaultValue: 'Social Profiles' })}
        </h3>
        <div className="portfolio-step__social-grid">
          <div className="portfolio-step__social-field">
            <label>
              <MusicNoteIcon />
              {t('form.portfolio.spotify', { defaultValue: 'Spotify URL' })}
            </label>
            <input
              type="url"
              value={socialLinks.spotify || ''}
              onChange={(e) => handleSocialChange('spotify', e.target.value)}
              placeholder="https://open.spotify.com/..."
            />
          </div>
          <div className="portfolio-step__social-field">
            <label>
              <LanguageIcon />
              {t('form.portfolio.soundcloud', { defaultValue: 'SoundCloud URL' })}
            </label>
            <input
              type="url"
              value={socialLinks.soundcloud || ''}
              onChange={(e) => handleSocialChange('soundcloud', e.target.value)}
              placeholder="https://soundcloud.com/..."
            />
          </div>
          <div className="portfolio-step__social-field">
            <label>
              <YouTubeIcon />
              {t('form.portfolio.youtube', { defaultValue: 'YouTube URL' })}
            </label>
            <input
              type="url"
              value={socialLinks.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div className="portfolio-step__social-field">
            <label>
              <InstagramIcon />
              {t('form.portfolio.instagram', { defaultValue: 'Instagram URL' })}
            </label>
            <input
              type="url"
              value={socialLinks.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="portfolio-step__section">
        <div className="portfolio-step__section-header">
          <h3 className="portfolio-step__section-title">
            <MicIcon className="portfolio-step__section-icon" />
            {t('form.portfolio.featuredProjects', { defaultValue: 'Featured Projects' })}
            <span className="portfolio-step__count">{portfolio.length} {t('form.portfolio.items', { defaultValue: 'Items' })}</span>
          </h3>
          <button onClick={() => setIsModalOpen(true)} className="portfolio-step__add-btn">
            <AddIcon /> {t('form.portfolio.addProject', { defaultValue: 'Add Project' })}
          </button>
        </div>

        {portfolio.length === 0 ? (
          <div className="portfolio-step__empty">
            <div className="portfolio-step__empty-icon">
              <MusicNoteIcon />
            </div>
            <h4>{t('form.portfolio.noProjects', { defaultValue: 'No projects added yet' })}</h4>
            <p>
              {t('form.portfolio.emptyDescription', {
                defaultValue: "Add audio tracks, music videos, or albums you've produced to show off your studio's capabilities."
              })}
            </p>
            <button onClick={() => setIsModalOpen(true)} className="portfolio-step__empty-link">
              {t('form.portfolio.addFirst', { defaultValue: 'Add your first project' })}
            </button>
          </div>
        ) : (
          <div className="portfolio-step__grid">
            <AnimatePresence>
              {portfolio.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="portfolio-item"
                >
                  {/* Cover Art */}
                  <div className="portfolio-item__cover">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt={item.title} />
                    ) : (
                      <div className="portfolio-item__cover-placeholder">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    <div className="portfolio-item__cover-overlay">
                      <div className="portfolio-item__play-btn">
                        {item.type === 'video' ? <PlayIcon /> : <MusicNoteIcon />}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="portfolio-item__info">
                    <div className="portfolio-item__meta">
                      <span className={`portfolio-item__type ${getTypeClass(item.type)}`}>
                        {item.type}
                      </span>
                      {item.role && <span className="portfolio-item__role">{item.role}</span>}
                    </div>
                    <h4 className="portfolio-item__title">{item.title}</h4>
                    <p className="portfolio-item__artist">{item.artist}</p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="portfolio-item__delete"
                    title={t('common.delete', { defaultValue: 'Delete' })}
                  >
                    <DeleteIcon />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioStep;
