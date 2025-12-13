import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { Studio } from 'src/types/index';
import { StudioRating, DistanceBadge } from '@shared/components';
import { StudioBadges } from './StudioBadges';

interface StudioFeaturesProps {
  studio?: Studio;
  showSmoking?: boolean;
  showAccessible?: boolean;
  averageRating?: number;
  reviewCount?: number;
  distance?: number | null;
}

export const StudioFeatures: React.FC<StudioFeaturesProps> = ({
  studio,
  showSmoking = false,
  showAccessible = false,
  averageRating,
  reviewCount,
  distance
}) => {
  return (
    <div className="studio-features-container">
      {averageRating !== undefined && (
        <StudioRating averageRating={averageRating} reviewCount={reviewCount} variant="badge" showCount={false} />
      )}
      {distance !== null && distance !== undefined && <DistanceBadge distance={distance} showIcon={false} />}
      {studio?.city && (
        <StudioBadges className="studio-city-badge">
          <span>{studio.city}</span>
        </StudioBadges>
      )}
      <div className="studio-features">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <span
            id="occupancy"
            aria-label={`Maximum occupancy for ${studio?.name?.en}: ${studio?.maxOccupancy || 0} people`}
          >
            {studio?.maxOccupancy || 0}
          </span>
        </div>
        {showSmoking && (
          <div role="group" aria-labelledby="smoking">
            <SmokingRooms aria-label="Smoking icon" />
            <span
              id="smoking"
              aria-label={`Smoking allowed at ${studio?.name?.en}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}
            >
              {studio?.isSmokingAllowed ? <Check /> : <Close />}
            </span>
          </div>
        )}
        {showAccessible && (
          <div role="group" aria-labelledby="accessible">
            <Accessible aria-label="Wheelchair accessible icon" />
            <span
              id="accessible"
              aria-label={`Wheelchair accessible at ${studio?.name.en}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
            >
              {studio?.isWheelchairAccessible ? <Check /> : <Close />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
