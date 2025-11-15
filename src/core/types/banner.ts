export interface BannerSlide {
  id: string;
  image: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
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
