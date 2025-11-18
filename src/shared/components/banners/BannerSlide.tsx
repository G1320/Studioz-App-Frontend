import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GenericImage } from '../images';
import { BannerSlide as BannerSlideType } from '../../../core/types/banner';

interface BannerSlideProps {
  slide: BannerSlideType;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ slide }) => {
  const { t, i18n } = useTranslation('banners');
  const {
    image,
    alt,
    altKey,
    title,
    titleKey,
    subtitle,
    subtitleKey,
    ctaText,
    ctaTextKey,
    ctaLink,
    overlayPosition = 'center',
    textColor = 'light'
  } = slide;

  const resolve = (key?: string, fallback?: string) => {
    if (key) return t(key);
    return fallback;
  };

  const resolvedTitle = resolve(titleKey, title);
  const resolvedSubtitle = resolve(subtitleKey, subtitle);
  const resolvedCtaText = resolve(ctaTextKey, ctaText);
  const resolvedAlt = resolve(altKey, alt || 'Banner image');

  const hasOverlay = resolvedTitle || resolvedSubtitle || resolvedCtaText;

  return (
    <div className={`banner-slide banner-slide--${overlayPosition} banner-slide--${textColor}`}>
      <div className="banner-slide__image-container">
        <GenericImage
          src={image}
          alt={resolvedAlt || 'Banner image'}
          className="banner-slide__image"
          width={1920}
          loading="eager"
        />
      </div>
      {hasOverlay && (
        <div className="banner-slide__overlay">
          <div className="banner-slide__content">
            {resolvedTitle && <h2 className="banner-slide__title">{resolvedTitle}</h2>}
            {resolvedSubtitle && <p className="banner-slide__subtitle">{resolvedSubtitle}</p>}
            {resolvedCtaText && ctaLink && (
              <Link to={`/${i18n.language}${ctaLink}`} className="banner-slide__cta" aria-label={resolvedCtaText}>
                {resolvedCtaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
