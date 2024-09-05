import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../layout/hero/hero';
import StudiosList from '../../entities/studios/studiosList';
import StudioPreview from '../../entities/studios/studioPreview';
import ItemPreview from '../../entities/items/itemPreview';
import GenericCarousel from '../../common/lists/genericSlickCarousel';
import { useWishlists } from '../../../hooks/dataFetching/useWishlists';
import { useUserContext } from '../../../contexts/UserContext';
import { Item } from '../../../../../shared/types';
import { Studio } from '../../../../../shared/types';

interface HomeProps {
  studios: Studio[];
  items: Item[];
}

const Home: React.FC<HomeProps> = ({ studios, items }) => {
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
        Try out our Mastering collection
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
