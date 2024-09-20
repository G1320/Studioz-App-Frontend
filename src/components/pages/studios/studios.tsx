import { StudiosList } from '@/components';
import { useParams } from 'react-router-dom';
import { Studio } from '@/types/index';

interface StudiosProps {
  studios: Studio[];
}

export const Studios: React.FC<StudiosProps> = ({ studios }) => {
  const { category, subcategory } = useParams();

  const filteredStudios: Studio[] = studios?.filter((studio) => {
    if (subcategory === undefined) {
      return studio?.category?.toLowerCase() === category?.toLowerCase();
    } else {
      return (
        studio?.category?.toLowerCase() === category?.toLowerCase() &&
        studio?.subCategory?.toLowerCase() === subcategory.toLowerCase()
      );
    }
  });
  return (
    <section className="studios-page">
      <h1>Check out our {category} Studios</h1>
      {subcategory && <h2>Specializing: {subcategory}</h2>}
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default Studios;
