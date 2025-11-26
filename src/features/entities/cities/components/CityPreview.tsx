import { CityConfig } from '@core/config/cities/cities';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocation, useSearchParams } from 'react-router-dom';
import '../styles/_city-preview.scss';

interface CityPreviewProps {
  city: CityConfig;
}

export const CityPreview: React.FC<CityPreviewProps> = ({ city }) => {
  const langNavigate = useLanguageNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
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

  return (
    <article className={`city-preview ${isSelected ? 'city-preview--selected' : ''}`} onClick={handleClick}>
      <span className="city-preview__name">{city.displayName || city.name}</span>
    </article>
  );
};
