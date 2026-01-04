import { Studio } from 'src/types/index';
import { useGenres } from '@shared/hooks';
import { GenreCard } from '@features/entities/genres';
import { useTranslation } from 'react-i18next';

interface StudioDetailsContentProps {
  studio?: Studio;
}

export const StudioDetailsContent: React.FC<StudioDetailsContentProps> = ({ studio }) => {
  const { getDisplayByEnglish } = useGenres();
  const { i18n } = useTranslation('forms');

  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  // Convert English genre values to display values
  const displayGenres = studio?.genres?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];

  return (
    <div className="studio-details__content">
      <p className="description">{studio?.description[currentLang] || studio?.description.en}</p>

      {displayGenres.length > 0 && (
        <div className="studio-genres">
          {displayGenres.slice(0, 8).map((genre, index) => (
            <GenreCard key={index} genre={genre} pathPrefix="studios" isInteractive={false} />
          ))}
        </div>
      )}
    </div>
  );
};
