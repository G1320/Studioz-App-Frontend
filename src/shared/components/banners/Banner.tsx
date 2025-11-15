import React from 'react';
import { GenericCarousel } from '../carousels';
import { BannerSlide } from './BannerSlide';
import { BannerConfig } from '../../../core/types/banner';
import './styles/_index.scss';

interface BannerProps {
  config: BannerConfig;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ config, className }) => {
  const { slides, autoplay = true } = config;

  const renderSlide = (slide: (typeof slides)[0]) => <BannerSlide slide={slide} />;

  // Full-width banner breakpoints - always show 1 slide
  const bannerBreakpoints = {
    0: { slidesPerView: 1 }
  };

  return (
    <div className={`banner ${className || ''}`}>
      <GenericCarousel
        data={slides}
        className="banner-carousel"
        renderItem={renderSlide}
        autoplay={autoplay}
        breakpoints={bannerBreakpoints}
      />
    </div>
  );
};
