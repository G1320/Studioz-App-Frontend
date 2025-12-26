import { GenericImage } from '@shared/components';
import { Studio } from 'src/types/index';

interface StudioCardHeaderProps {
  studio?: Studio;
  onClick?: () => void;
}

export const StudioCardHeader: React.FC<StudioCardHeaderProps> = ({ studio, onClick }) => {
  if (!studio?.coverImage) {
    return (
      <div className="studio-card-header">
        <div className="studio-card-header__placeholder" />
      </div>
    );
  }

  return (
    <div className="studio-card-header" onClick={onClick}>
      <GenericImage
        src={studio.coverImage}
        alt={`${studio.name?.en || 'Studio'} cover image`}
        className="studio-card-header__image"
        width={800}
        loading="lazy"
      />
    </div>
  );
};

