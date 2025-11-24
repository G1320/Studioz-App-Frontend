import { CityConfig } from '@core/config/cities/cities';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useSearchParams } from 'react-router-dom';
import '../styles/_city-preview.scss';

interface CityPreviewProps {
  city: CityConfig;
}

export const CityPreview: React.FC<CityPreviewProps> = ({ city }) => {
  const langNavigate = useLanguageNavigate();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city');
  const isSelected = selectedCity === city.name;

  const handleClick = () => {
    const encodedCity = encodeURIComponent(city.name);
    langNavigate(`/studios?city=${encodedCity}`);
  };

  return (
    <article className={`city-preview ${isSelected ? 'city-preview--selected' : ''}`} onClick={handleClick}>
      <span className="city-preview__name">{city.displayName || city.name}</span>
    </article>
  );
};

