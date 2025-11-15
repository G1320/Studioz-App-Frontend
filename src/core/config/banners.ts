import { BannerConfig } from '../types/banner';

export const homeBanners: BannerConfig = {
  id: 'home-banners',
  slides: [
    {
      id: 'banner-1',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920',
      alt: 'Music production studio',
      title: 'Discover Amazing Studios',
      subtitle: 'Find the perfect space for your next project',
      ctaText: 'Explore Studios',
      ctaLink: '/studios',
      overlayPosition: 'left',
      textColor: 'light'
    },
    {
      id: 'banner-2',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920',
      alt: 'Professional recording equipment',
      title: 'Premium Services',
      subtitle: 'Get professional mixing and mastering services',
      ctaText: 'View Services',
      ctaLink: '/services',
      overlayPosition: 'center',
      textColor: 'light'
    },
    {
      id: 'banner-3',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920',
      alt: 'Music production',
      title: 'Book Your Session',
      subtitle: 'Reserve your studio time today',
      ctaText: 'Book Now',
      ctaLink: '/studios',
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
