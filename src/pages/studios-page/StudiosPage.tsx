import { StudiosList } from '@components/index';
import { useParams } from 'react-router-dom';
import { Studio } from 'src/types/index';

interface StudiosPageProps {
  studios: Studio[];
}

const StudiosPage: React.FC<StudiosPageProps> = ({ studios }) => {
  const { category, subcategory } = useParams();

  const filteredStudios: Studio[] = studios?.filter((studio) => {
    if (subcategory === undefined) {
      return studio?.category?.toLowerCase() === category?.toLowerCase();
    } else {
      return studio?.subCategories?.includes(subcategory);
    }
  });
  return (
    <section className="studios-page">
      {subcategory && <h1>{subcategory} Studioz</h1>}
      <StudiosList studios={filteredStudios} />
    </section>
  );
};

export default StudiosPage;
