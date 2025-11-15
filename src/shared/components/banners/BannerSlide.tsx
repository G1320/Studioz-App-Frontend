import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GenericImage } from '../images';
import { BannerSlide as BannerSlideType } from '../../../core/types/banner';

interface BannerSlideProps {
  slide: BannerSlideType;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ slide }) => {
  const { i18n } = useTranslation();
  const { image, alt, title, subtitle, ctaText, ctaLink, overlayPosition = 'center', textColor = 'light' } = slide;

  const hasOverlay = title || subtitle || ctaText;

  return (
    <div className={`banner-slide banner-slide--${overlayPosition} banner-slide--${textColor}`}>
      <div className="banner-slide__image-container">
        <GenericImage
          src={image}
          alt={alt || 'Banner image'}
          className="banner-slide__image"
          width={1920}
          loading="eager"
        />
      </div>
      {hasOverlay && (
        <div className="banner-slide__overlay">
          <div className="banner-slide__content">
            {title && <h2 className="banner-slide__title">{title}</h2>}
            {subtitle && <p className="banner-slide__subtitle">{subtitle}</p>}
            {ctaText && ctaLink && (
              <Link to={`/${i18n.language}${ctaLink}`} className="banner-slide__cta" aria-label={ctaText}>
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
