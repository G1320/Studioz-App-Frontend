import { BannerConfig } from '../types/banner';

export const homeBanners: BannerConfig = {
  id: 'home-banners',
  slides: [
    {
      id: 'banner-1',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920',
      altKey: 'home.banner1.alt',
      titleKey: 'home.banner1.title',
      subtitleKey: 'home.banner1.subtitle',
      ctaTextKey: 'home.banner1.cta',
      ctaLink: '/studio/create',
      overlayPosition: 'left',
      textColor: 'light'
    },
    {
      id: 'banner-2',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920',
      altKey: 'home.banner2.alt',
      titleKey: 'home.banner2.title',
      subtitleKey: 'home.banner2.subtitle',
      ctaTextKey: 'home.banner2.cta',
      ctaLink: '/studio/create',
      overlayPosition: 'center',
      textColor: 'light'
    },
    {
      id: 'banner-3',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920',
      altKey: 'home.banner3.alt',
      titleKey: 'home.banner3.title',
      subtitleKey: 'home.banner3.subtitle',
      ctaTextKey: 'home.banner3.cta',
      ctaLink: '/studio/create',
      overlayPosition: 'right',
      textColor: 'light'
    }
  ],
  autoplay: true,
  autoplayDelay: 5000,
  showPagination: true,
  showNavigation: true
};

export const bannerConfigs: BannerConfig[] = [homeBanners];
