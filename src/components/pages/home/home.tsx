import { useNavigate } from 'react-router-dom';
import { StudiosList, GenericCarousel, StudioPreview, ItemPreview } from '@/components';

import { useWishlists } from '@/hooks';
import { useUserContext } from '@/contexts';
import { Studio, Item } from '@/types/index';
import { filterBySubcategory } from '@/utils/filterBySubcategory';

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
  const masteringItems = filterBySubcategory(items, 'Mastering');

  return (
    <section className="home">
      <h1 onClick={() => navigate('/studios/music/recording')}>Check out our latest Recording Studioz</h1>
      <GenericCarousel
        data={recordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        isAutoplay={true}
      />
      <h1 onClick={() => navigate('/studios/music/mixing')}>Charge up your mix with a professionals touch</h1>
      <StudiosList studios={mixingStudios.slice(0, 6)} />
      <h1 onClick={() => navigate('/services/music/mastering')}>Polish your tracks with decades of experience</h1>
      <GenericCarousel data={masteringItems} className="items-carousel" renderItem={itemRenderItem} />
    </section>
  );
};

export default Home;
