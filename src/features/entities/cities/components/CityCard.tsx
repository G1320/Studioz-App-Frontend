import { CityConfig } from '@core/config/cities/cities';
import { useLanguageNavigate, useCities } from '@shared/hooks/utils';
import { useLocation, useSearchParams } from 'react-router-dom';
import '../styles/_city-card.scss';

interface CityCardProps {
  city: CityConfig;
}

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const langNavigate = useLanguageNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getDisplayByCityName } = useCities();
  const selectedCity = searchParams.get('city');
  const isSelected = selectedCity === city.name;

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(location.search);

    if (isSelected) {
      newSearchParams.delete('city');
    } else {
      newSearchParams.set('city', city.name);
    }

    const strippedPath = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '');
    const nextPath = strippedPath.length > 0 ? strippedPath : '/studios';
    const searchString = newSearchParams.toString();

    langNavigate(`${nextPath}${searchString ? `?${searchString}` : ''}`);
  };

  const displayName = getDisplayByCityName(city.name);

  return (
    <article className={`city-card ${isSelected ? 'city-card--selected' : ''}`} onClick={handleClick}>
      <span className="city-card__name">{displayName}</span>
    </article>
  );
};

