import {
  StudiosList,
  GenericCarousel,
  StudioPreview,
  ItemPreview,
  CategoryPreview,
  Hero,
  ItemDetails,
  GenericModal
} from '@components/index';
import { useWishlists } from '@hooks/index';
import { useModal, useUserContext } from '@contexts/index';
import { Studio, Item } from 'src/types/index';
import { filterBySubcategory } from '@utils/index';
import { useTranslation } from 'react-i18next';
import { useMusicSubCategories } from '@hooks/index';

interface HomePageProps {
  studios: Studio[];
  items: Item[];
}

const HomePage: React.FC<HomePageProps> = ({ studios, items }) => {
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { t } = useTranslation('homePage');
  const musicSubCategories = useMusicSubCategories();

  const { selectedItem, openModal, closeModal } = useModal();

  const studioRenderItem = (studio: Studio) => <StudioPreview studio={studio} />;
  const itemRenderItem = (item: Item) => (
    <div onClick={() => handleItemClick(item)} key={item._id}>
      <ItemPreview item={item} wishlists={wishlists} />
    </div>
  );
  const categoryRenderItem = (category: string) => <CategoryPreview category={category} />;

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
    <section className="home-page">
      <Hero />

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
      <GenericCarousel
        data={studios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        autoplay={true}
        title={t('sections.studioz_for_you')}
        seeAllPath="/studios"
      />
      <GenericCarousel
        data={items}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.the_best_in_the_biz')}
        seeAllPath="/services"
      />
      <GenericCarousel
        data={recordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.recording_studioz')}
        seeAllPath="/studios/music/Vocal%20&%20Instrument%20Recording"
      />
      <GenericCarousel
        data={mixingItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.mixing_services')}
        seeAllPath="/services/music/Mixing"
      />
      <GenericCarousel
        data={podcastRecordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.podcast_studioz')}
        seeAllPath="/studios/music/Podcast%20Recording"
      />
      <h2>{t('sections.charge_up_your_mix')}</h2>
      <StudiosList studios={mixingStudios.slice(0, 6)} />
      <GenericCarousel
        data={masteringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.mastering_studioz')}
        seeAllPath="/studios/music/Mastering"
      />
      <GenericCarousel
        data={audioEngineeringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title={t('sections.audio_engineerz')}
        seeAllPath="/studios/music/Music%20Production"
      />
      <h2>{t('sections.book_now_think_later')}</h2>
      <StudiosList studios={mixingStudios.slice(4, 10)} />
      <GenericCarousel
        data={masteringItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title={t('sections.mastering_services')}
        seeAllPath="/services/music/Mastering"
      />
      <GenericModal open={!!selectedItem} onClose={closeModal} className="item-modal">
        {selectedItem && <ItemDetails itemId={selectedItem._id} />}
      </GenericModal>
    </section>
  );
};

export default HomePage;
