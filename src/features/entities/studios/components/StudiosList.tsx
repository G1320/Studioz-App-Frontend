import { StudioCard } from './StudioCard';
import { EmptyState, GenericList } from '@shared/components';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { useTranslation } from 'react-i18next';
import { Studio } from 'src/types/index';
interface StudiosListProps {
  studios: Studio[];
  title?: string;
  hasFilters?: boolean;
}

export const StudiosList: React.FC<StudiosListProps> = ({ studios, title, hasFilters = false }) => {
  const { t } = useTranslation('studios');
  const langNavigate = useLanguageNavigate();
  const renderItem = (studio: Studio) => <StudioCard studio={studio} />;

  if (!studios.length) {
    return (
      <section className="studios-list-container studios-list-container--empty">
        {title && <h1 className="studio-list-title">{title}</h1>}
        <EmptyState
          icon="🎛️"
          title={hasFilters ? t('emptyStates.noMatchingFilters') : t('emptyStates.noStudios')}
          subtitle={
            hasFilters ? t('emptyStates.tryDifferentFilters') : t('emptyStates.discoverStudios')
          }
          actionLabel={t('emptyStates.returnHome')}
          onAction={() => langNavigate('/')}
        />
      </section>
    );
  }

  return (
    <section className="studios-list-container">
      {title && <h1 className="studio-list-title">{title}</h1>}
      <GenericList data={studios} renderItem={renderItem} className="studios-list" />
    </section>
  );
};
