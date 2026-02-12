import '../styles/_index.scss';
import { StudiosList } from '@features/entities/studios/components/StudiosList';
import { StudioCard } from '@features/entities/studios/components/StudioCard';
import { ItemCard } from '@features/entities/items/components/ItemCard';
import { CategoryCard } from '@features/entities/categories/components/CategoryCard';
import { GenericCarousel, Banner } from '@shared/components';
import { useWishlists, useMusicSubCategories } from '@shared/hooks';
import { useModal, useUserContext } from '@core/contexts';
import { Studio, Item } from 'src/types/index';
import { filterBySubcategory } from '@shared/utils';
import { useTranslation } from 'react-i18next';
import { homeBanners } from '@core/config';

interface DiscoverPageProps {
  studios: Studio[];
  items: Item[];
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ studios, items }) => {
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { t } = useTranslation('discoverPage');
  const musicSubCategories = useMusicSubCategories();

  const { openModal } = useModal();

  const studioRenderItem = (studio: Studio) => <StudioCard studio={studio} />;
  const itemRenderItem = (item: Item) => (
    <div onClick={() => handleItemClick(item)} key={item._id}>
      <ItemCard item={item} wishlists={wishlists} />
    </div>
  );
  const categoryRenderItem = (category: string) => <CategoryCard category={category} />;

  const recordingStudios = filterBySubcategory(studios, 'Vocal & Instrument Recording');
  const mixingStudios = filterBySubcategory(studios, 'Mixing');
  const audioEngineeringStudios = filterBySubcategory(studios, 'Music Production');
  const masteringStudios = filterBySubcategory(studios, 'Mastering');
  const podcastRecordingStudios = filterBySubcategory(studios, 'Podcast Recording');
  const mixingItems = filterBySubcategory(items, 'Mixing');
  const masteringItems = filterBySubcategory(items, 'Mastering');

  const handleItemClick = (item: Item) => {
    openModal(item);
  };

  return (
    <section className="discover-page">
      <GenericCarousel
        data={musicSubCategories}
        className="categories-carousel slider-gradient"
        renderItem={categoryRenderItem}
        title={t('sections.categories')}
        breakpoints={{
          340: { slidesPerView: 3.4 },
          520: { slidesPerView: 4.2 },
          800: { slidesPerView: 4.4 },
          1000: { slidesPerView: 5.2 },
          1200: { slidesPerView: 6.2 },
          1550: { slidesPerView: 7.2 }
        }}
      />
      <Banner config={homeBanners} />

      <GenericCarousel
        data={studios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        autoplay={false}
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
      <h2>{t('sections.charge_up_your_mix')}</h2>
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
      <h2>{t('sections.book_now_think_later')}</h2>
      <StudiosList studios={mixingStudios.slice(4, 10)} />
      <GenericCarousel
        data={masteringItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.mastering_services')}
      />
    </section>
  );
};

export default DiscoverPage;
