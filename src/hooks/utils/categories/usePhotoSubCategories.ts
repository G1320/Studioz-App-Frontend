import { useTranslation } from 'react-i18next';

export const usePhotoSubCategories = () => {
  const { t } = useTranslation('categories');

  return [
    t('subCategories.photoAndVideo.film_production'),
    t('subCategories.photoAndVideo.photography_studio'),
    t('subCategories.photoAndVideo.video_editing'),
    t('subCategories.photoAndVideo.cinematography'),
    t('subCategories.photoAndVideo.commercial_photography'),
    t('subCategories.photoAndVideo.documentary_production'),
    t('subCategories.photoAndVideo.wedding_photography'),
    t('subCategories.photoAndVideo.portrait_photography'),
    t('subCategories.photoAndVideo.fashion_photography'),
    t('subCategories.photoAndVideo.event_videography'),
    t('subCategories.photoAndVideo.music_video_production'),
    t('subCategories.photoAndVideo.drone_photography_videography'),
    t('subCategories.photoAndVideo.green_screen_studio'),
    t('subCategories.photoAndVideo.food_photography'),
    t('subCategories.photoAndVideo.product_photography'),
    t('subCategories.photoAndVideo.studio_rental'),
    t('subCategories.photoAndVideo.video_animation'),
    t('subCategories.photoAndVideo.virtual_tour_creation'),
    t('subCategories.photoAndVideo.360_photography_videography'),
    t('subCategories.photoAndVideo.headshot_photography'),
    t('subCategories.photoAndVideo.real_estate_photography_videography'),
    t('subCategories.photoAndVideo.corporate_videography'),
    t('subCategories.photoAndVideo.artistic_photography'),
    t('subCategories.photoAndVideo.educational_videos'),
    t('subCategories.photoAndVideo.travel_photography_videography'),
    t('subCategories.photoAndVideo.video_game_streaming_setup'),
    t('subCategories.photoAndVideo.video_blogging'),
    t('subCategories.photoAndVideo.stock_photography_videography'),
    t('subCategories.photoAndVideo.visual_effects'),
    t('subCategories.photoAndVideo.stop_motion_animation')
  ];
};
