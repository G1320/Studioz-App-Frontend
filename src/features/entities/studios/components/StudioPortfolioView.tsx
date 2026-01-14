import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem, SocialLinks } from 'src/types/studio';

import {
  PlayIcon,
  MusicNoteIcon,
  VideocamIcon,
  AlbumIcon,
  YouTubeIcon,
  InstagramIcon,
  LanguageIcon,
  HeadphonesIcon
} from '@shared/components/icons';

import '../styles/_studio-portfolio-view.scss';

interface StudioPortfolioViewProps {
  portfolio?: PortfolioItem[];
  socialLinks?: SocialLinks;
}

type FilterType = 'all' | 'audio' | 'video' | 'album';

const FilterChip: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}> = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`portfolio-filter-chip ${active ? 'portfolio-filter-chip--active' : ''}`}
  >
    {children}
    {count !== undefined && count > 0 && (
      <span className="portfolio-filter-chip__count">{count}</span>
    )}
  </button>
);

const SocialButton: React.FC<{
  icon: React.ElementType;
  href: string;
  label: string;
}> = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="portfolio-social-btn"
  >
    <div className="portfolio-social-btn__icon">
      <Icon />
    </div>
    <span className="portfolio-social-btn__label">{label}</span>
  </a>
);

export const StudioPortfolioView: React.FC<StudioPortfolioViewProps> = ({
  portfolio = [],
  socialLinks
}) => {
  const { t, i18n } = useTranslation('forms');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems = useMemo(() => {
    if (filter === 'all') return portfolio;
    return portfolio.filter((item) => item.type === filter);
  }, [portfolio, filter]);

  const counts = useMemo(() => ({
    all: portfolio.length,
    audio: portfolio.filter((i) => i.type === 'audio').length,
    video: portfolio.filter((i) => i.type === 'video').length,
    album: portfolio.filter((i) => i.type === 'album').length
  }), [portfolio]);

  const hasSocialLinks = socialLinks && Object.values(socialLinks).some((link) => link?.trim());

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
        return 'portfolio-card__type--video';
      case 'album':
        return 'portfolio-card__type--album';
      default:
        return 'portfolio-card__type--audio';
    }
  };

  if (portfolio.length === 0 && !hasSocialLinks) {
    return null;
  }

  return (
    <div className="studio-portfolio-view" dir={i18n.dir()}>
      {/* Header Section */}
      {portfolio.length > 0 && (
        <>
          <div className="studio-portfolio-view__header">
            <div className="studio-portfolio-view__title-section">
              <h2 className="studio-portfolio-view__title">
                {t('form.portfolio.selectedWorks', { defaultValue: 'Selected Works' })}
              </h2>
              <p className="studio-portfolio-view__subtitle">
                {t('form.portfolio.collectionDesc', {
                  defaultValue: 'A collection of tracks, albums, and visual projects created at our studio.'
                })}
              </p>
            </div>

            {/* Filter Chips */}
            <div className="studio-portfolio-view__filters">
              <FilterChip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                count={counts.all}
              >
                {t('form.portfolio.filterAll', { defaultValue: 'All' })}
              </FilterChip>
              <FilterChip
                active={filter === 'audio'}
                onClick={() => setFilter('audio')}
                count={counts.audio}
              >
                {t('form.portfolio.filterAudio', { defaultValue: 'Audio' })}
              </FilterChip>
              <FilterChip
                active={filter === 'video'}
                onClick={() => setFilter('video')}
                count={counts.video}
              >
                {t('form.portfolio.filterVideo', { defaultValue: 'Video' })}
              </FilterChip>
              <FilterChip
                active={filter === 'album'}
                onClick={() => setFilter('album')}
                count={counts.album}
              >
                {t('form.portfolio.filterAlbums', { defaultValue: 'Albums' })}
              </FilterChip>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="studio-portfolio-view__grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="portfolio-card"
                >
                  {/* Card Image */}
                  <div className="portfolio-card__image-wrapper">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt={item.title} className="portfolio-card__image" />
                    ) : (
                      <div className="portfolio-card__image-placeholder">
                        {getTypeIcon(item.type)}
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="portfolio-card__overlay" />

                    {/* Type Badge */}
                    <div className={`portfolio-card__type ${getTypeClass(item.type)}`}>
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </div>

                    {/* Play Button */}
                    <div className="portfolio-card__play-btn">
                      <PlayIcon />
                    </div>

                    {/* Role Badge */}
                    {item.role && (
                      <div className="portfolio-card__role">
                        {t('form.portfolio.role', { defaultValue: 'Role' })}: {item.role}
                      </div>
                    )}
                  </div>

                  {/* Meta Data */}
                  <div className="portfolio-card__meta">
                    <h3 className="portfolio-card__title">{item.title}</h3>
                    <p className="portfolio-card__artist">{item.artist}</p>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Social Links Section */}
      {hasSocialLinks && (
        <div className="studio-portfolio-view__socials">
          <h3 className="studio-portfolio-view__socials-title">
            {t('form.portfolio.connectListen', { defaultValue: 'Connect & Listen' })}
          </h3>
          <div className="studio-portfolio-view__socials-grid">
            {socialLinks?.spotify && (
              <SocialButton icon={MusicNoteIcon} label="Spotify" href={socialLinks.spotify} />
            )}
            {socialLinks?.youtube && (
              <SocialButton icon={YouTubeIcon} label="YouTube" href={socialLinks.youtube} />
            )}
            {socialLinks?.instagram && (
              <SocialButton icon={InstagramIcon} label="Instagram" href={socialLinks.instagram} />
            )}
            {socialLinks?.soundcloud && (
              <SocialButton icon={HeadphonesIcon} label="SoundCloud" href={socialLinks.soundcloud} />
            )}
            {socialLinks?.website && (
              <SocialButton icon={LanguageIcon} label="Website" href={socialLinks.website} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioPortfolioView;
