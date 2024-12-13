import { useTranslation } from 'react-i18next';

export const useMusicSubCategories = () => {
  const { t } = useTranslation('categories');

  return [
    t('subCategories.musicAndPodcast.music_production'),
    t('subCategories.musicAndPodcast.podcast_recording'),
    t('subCategories.musicAndPodcast.vocal_instrument_recording'),
    t('subCategories.musicAndPodcast.mixing'),
    t('subCategories.musicAndPodcast.mastering'),
    t('subCategories.musicAndPodcast.sound_design'),
    t('subCategories.musicAndPodcast.film_post_production'),
    t('subCategories.musicAndPodcast.voiceover_dubbing'),
    t('subCategories.musicAndPodcast.studio_rental'),
    t('subCategories.musicAndPodcast.band_rehearsal'),
    t('subCategories.musicAndPodcast.foley_sound_effects'),
    t('subCategories.musicAndPodcast.workshops_classes'),
    t('subCategories.musicAndPodcast.remote_production_services'),
    t('subCategories.musicAndPodcast.restoration_archiving')
  ];
};
