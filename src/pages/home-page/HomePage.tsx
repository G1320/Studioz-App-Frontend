import { StudiosList, GenericCarousel, StudioPreview, ItemPreview, Hero } from '@components/index';
import { useWishlists } from '@hooks/index';
import { useUserContext } from '@contexts/index';
import { Studio, Item } from '@models/index';
import { filterBySubcategory } from '@utils/index';
import { useTranslation } from 'react-i18next';

interface HomePageProps {
  studios: Studio[];
  items: Item[];
}

const HomePage: React.FC<HomePageProps> = ({ studios, items }) => {
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { t } = useTranslation('homePage');

  const studioRenderItem = (studio: Studio) => <StudioPreview studio={studio} />;
  const itemRenderItem = (item: Item) => <ItemPreview item={item} wishlists={wishlists} key={item._id} />;

  const recordingStudios = filterBySubcategory(studios, 'Recording');
  const mixingStudios = filterBySubcategory(studios, 'Mixing');
  const audioEngineeringStudios = filterBySubcategory(studios, 'Audio engineering');
  const masteringStudios = filterBySubcategory(studios, 'Mastering');
  const podcastRecordingStudios = filterBySubcategory(studios, 'Podcast recording');
  const mixingItems = filterBySubcategory(items, 'Mixing');
  const masteringItems = filterBySubcategory(items, 'Mastering');
  return (
    <section className="home-page">
      <Hero />

      <GenericCarousel
        data={studios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        autoplay={true}
        title={t('sections.studioz_for_you')}
      />
      <GenericCarousel
        data={items}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.the_best_in_the_biz')}
      />
      <GenericCarousel
        data={recordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.recording_studioz')}
      />
      <GenericCarousel
        data={mixingItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.mixing_services')}
      />
      <GenericCarousel
        data={podcastRecordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.podcast_studioz')}
      />
      <h1>{t('sections.charge_up_your_mix')}</h1>
      <StudiosList studios={mixingStudios.slice(0, 6)} />
      <GenericCarousel
        data={masteringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.mastering_studioz')}
      />
      <GenericCarousel
        data={audioEngineeringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.audio_engineerz')}
      />
      <h1>{t('sections.book_now_think_later')}</h1>
      <StudiosList studios={mixingStudios.slice(7, 12)} />
      <GenericCarousel
        data={masteringItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.mastering_services')}
      />
    </section>
  );
};

export default HomePage;
