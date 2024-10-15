import { useNavigate } from 'react-router-dom';
import { StudiosList, GenericCarousel, StudioPreview, ItemPreview } from '@/components';

import { useWishlists } from '@/hooks';
import { useUserContext } from '@/contexts';
import { Studio, Item } from '@/types/index';
import { filterBySubcategory } from '@/utils';

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

  return (
    <section className="home">
      <h1 onClick={() => navigate('/studios/music/recording')}>Studioz for you</h1>
      <GenericCarousel
        data={studios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
        autoplay={true}
      />
      <h1 onClick={() => navigate('/services')}>The best in the biz</h1>
      <GenericCarousel data={items} className="items-carousel" renderItem={itemRenderItem} />
      <h1 onClick={() => navigate('/studios/music/recording')}>Recording Studioz</h1>
      <GenericCarousel
        data={recordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />
      <h1 onClick={() => navigate('/services/music/mixing')}>Mixing Services</h1>
      <GenericCarousel data={mixingItems} className="items-carousel" renderItem={itemRenderItem} />
      <h1 onClick={() => navigate('/studios/music/podcast recording')}>Podcast Studioz</h1>
      <GenericCarousel
        data={podcastRecordingStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />
      <h1 onClick={() => navigate('/studios/music/mixing')}>Charge up your mix with a professional touch</h1>
      <StudiosList studios={mixingStudios.slice(0, 6)} />

      <h1 onClick={() => navigate('/studios/music/mastering')}>Mastering Studioz</h1>
      <GenericCarousel
        data={masteringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />

      <h1 onClick={() => navigate('/studios/music/Audio engineering')}>Audio Engineerz</h1>
      <GenericCarousel
        data={audioEngineeringStudios}
        className="studios-carousel slider-gradient"
        renderItem={studioRenderItem}
      />
    </section>
  );
};

export default Home;
