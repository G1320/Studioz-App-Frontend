export interface BannerSlide {
  id: string;
  image: string;
  alt?: string;
  altKey?: string;
  title?: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  ctaText?: string;
  ctaTextKey?: string;
  ctaLink?: string;
  overlayPosition?: 'left' | 'center' | 'right';
  textColor?: 'light' | 'dark';
}

export interface BannerConfig {
  id: string;
  slides: BannerSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}
