import { StudioCard } from '@features/entities';
import { GenericList } from '@shared/components';
import { Studio } from 'src/types/index';
interface StudiosListProps {
  studios: Studio[];
  title?: string;
}

export const StudiosList: React.FC<StudiosListProps> = ({ studios, title }) => {
  const renderItem = (studio: Studio) => <StudioCard studio={studio} />;

  return (
    <section className="studios-list-container">
      {title && <h1 className="studio-list-title">{title}</h1>}
      <GenericList data={studios} renderItem={renderItem} className="studios-list" />
    </section>
  );
};
