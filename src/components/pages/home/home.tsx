import { useNavigate } from 'react-router-dom';
import { StudiosList, GenericCarousel, StudioPreview, ItemPreview } from '@/components';

import { useWishlists } from '@/hooks';
import { useUserContext } from '@/contexts';
import { Studio, Item } from '@/types/index';
import { filterBySubcategory, shuffleArray } from '@/utils';

interface HomeProps {
  studios: Studio[];
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ studios, items }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

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
    <section className="home">
      <GenericCarousel
        data={shuffleArray(studios)}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        autoplay={true}
        title="Studioz for you"
      />
      <GenericCarousel
        data={shuffleArray(items)}
        className="items-carousel"
        renderItem={itemRenderItem}
        title="The best in the biz"
      />
      <GenericCarousel
        data={recordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title="Recording Studioz"
      />
      <GenericCarousel
        data={mixingItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title="Mixing Services"
      />
      <GenericCarousel
        data={podcastRecordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title="Podcast Studioz"
      />
      <h1 onClick={() => navigate('/studios/music/mixing')}>Charge up your mix with a professional touch</h1>
      <StudiosList studios={mixingStudios.slice(0, 6)} />

      <GenericCarousel
        data={masteringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title="Mastering Studioz"
      />

      <GenericCarousel
        data={audioEngineeringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        title="Audio Engineerz"
      />
      <h1 onClick={() => navigate('/studios/music')}>Book now, think later</h1>
      <StudiosList studios={mixingStudios.slice(7, 12)} />
      <GenericCarousel
        data={masteringItems}
        className="items-carousel"
        renderItem={itemRenderItem}
        title="Mastering Services"
      />
    </section>
  );
};

export default Home;
