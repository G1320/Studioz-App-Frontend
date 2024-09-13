import { useNavigate } from 'react-router-dom';
import { Hero, StudiosList, GenericCarousel, StudioPreview, ItemPreview } from '@/components';

import { useWishlists } from '@/hooks';
import { useUserContext } from '@/contexts';
import { Studio,Item } from '@/types/index';

interface HomeProps {
  studios: Studio[];
  items: Item[];
}

 export const Home: React.FC<HomeProps> = ({ studios, items }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const studioRenderItem = (studio:Studio) => <StudioPreview studio={studio} />;
  const itemRenderItem = (item:Item) => <ItemPreview item={item} wishlists={wishlists} key={item._id} />;

  return (
    <section className="home">
      <Hero/>
      <h1 onClick={() => navigate('/studios/music/recording')}>
        Check out our latest Recording Studioz
      </h1>
      <GenericCarousel
        data={studios?.slice(0, 6)}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />
      <h1 onClick={() => navigate('/studios/music/mixing')}>Browse the Mixing collection</h1>
      <StudiosList studios={studios?.slice(0, 6)} />
      <h1 onClick={() => navigate('/services/music/mastering')}>
        Try out our Mastering services
      </h1>
      <GenericCarousel
        data={items?.slice(0, 12)}
        className="items-carousel"
        renderItem={itemRenderItem}
      />
    </section>
  );
};

export default Home;
