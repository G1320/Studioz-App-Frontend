import { StudioPreview, GenericList } from '@/components';
import { Studio } from '@/types/index';
interface StudiosListProps {
  studios: Studio[];
}

export const StudiosList: React.FC<StudiosListProps> = ({ studios }) => {
  const renderItem = (studio: Studio) => <StudioPreview studio={studio} />;

  return (
    <section className="studios">
      <GenericList data={studios} renderItem={renderItem} className="studios-list" />
    </section>
  );
};

export default StudiosList;
