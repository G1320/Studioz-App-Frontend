import React from 'react';
import Hero from '../../layout/hero/hero';
import StudiosList from '../../entities/studios/studiosList';
import StudioPreview from '../../entities/studios/studioPreview';
import ItemPreview from '../../entities/items/itemPreview';
import GenericCarousel from '../../common/lists/genericSlickCarousel';
import { useNavigate } from 'react-router-dom';

const Home = ({ studios, items }) => {
  const navigate = useNavigate();

  const studioRenderItem = (studio) => <StudioPreview studio={studio} />;
  const itemRenderItem = (item) => <ItemPreview item={item} />;

  return (
    <section className="home">
      <Hero></Hero>
      <h1 onClick={() => navigate('/studios/music/recording')}>
        Check out our latest Recording Studios
      </h1>
      <GenericCarousel
        data={studios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />
      <h1 onClick={() => navigate('/studios/music/mastering')}>Browse the Mastering collection</h1>
      <StudiosList studios={studios} />
      <h1 onClick={() => navigate('/services/music/mastering')}>
        Polish you tracks with professional Mastering
      </h1>
      <GenericCarousel data={items} className="items-carousel" renderItem={itemRenderItem} />
    </section>
  );
};

export default Home;
