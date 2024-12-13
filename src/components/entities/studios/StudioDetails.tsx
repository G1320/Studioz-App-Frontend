import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery } from '@components/index';
import { Studio } from 'src/types/index';

interface StudioDetailsProps {
  studio?: Studio;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio }) => {
  return (
    <article key={studio?._id} className="details studio-details">
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={true}
      />
      <div className="studio-details-name-and-city">
        <h3 className="title">{studio?.name}</h3>
        <small className="city">{studio?.city}</small>
      </div>

      <div className="availability">
        <h3>Opening Hours</h3>
        <ul>
          {studio?.studioAvailability?.days.map((day, index) => (
            <li key={index}>
              <strong>{day}:</strong> {studio.studioAvailability?.times[0]?.start || 'Closed'} -{' '}
              {studio.studioAvailability?.times[0]?.end || 'Closed'}
            </li>
          ))}
        </ul>
      </div>
      <p className="description">{studio?.description}</p>
      <div className="options-wrapper">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <p id="occupancy" aria-label={`Maximum occupancy for ${studio?.name}: ${studio?.maxOccupancy || 0} people`}>
            {studio?.maxOccupancy || 0}
          </p>
        </div>
        <div role="group" aria-labelledby="smoking">
          <SmokingRooms aria-label="Smoking icon" />
          <p id="smoking" aria-label={`Smoking allowed at ${studio?.name}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}>
            {studio?.isSmokingAllowed ? <Check /> : <Close />}
          </p>
        </div>
        <div role="group" aria-labelledby="accessible">
          <Accessible aria-label="Wheelchair accessible icon" />
          <p
            id="accessible"
            aria-label={`Wheelchair accessible at ${studio?.name}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
          >
            {studio?.isWheelchairAccessible ? <Check /> : <Close />}
          </p>
        </div>
      </div>
      <h3>{studio?.items.length} Services Available</h3>
    </article>
  );
};
