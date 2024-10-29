import { StudioPreview, GenericList } from '@components/index';
import { Studio } from '@models/index';
interface StudiosListProps {
  studios: Studio[];
  title?: string;
}

export const StudiosList: React.FC<StudiosListProps> = ({ studios, title }) => {
  const renderItem = (studio: Studio) => <StudioPreview studio={studio} />;

  return (
    <section className="studios">
      {title && <h1 className="studio-list-title">{title}</h1>}
      <GenericList data={studios} renderItem={renderItem} className="studios-list" />
    </section>
  );
};
