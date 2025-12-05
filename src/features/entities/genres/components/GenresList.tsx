import { GenericList } from '@shared/components';
import { GenreCard } from './GenreCard';
import { useMusicGenres } from '@shared/hooks';

interface GenresListProps {
  pathPrefix?: string;
  className?: string;
}

export const GenresList: React.FC<GenresListProps> = ({ pathPrefix = 'studios', className }) => {
  const genres = useMusicGenres();

  const renderItem = (genre: string) => <GenreCard genre={genre} pathPrefix={pathPrefix} />;

  return (
    <section className={`genres-list ${className || ''}`}>
      <GenericList data={genres} renderItem={renderItem} className="genres-list" />
    </section>
  );
};

