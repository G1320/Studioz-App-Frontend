import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery } from '@components/index';
import { Studio } from 'src/types/index';

interface StudioDetailsProps {
  studio?: Studio;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio }) => {
  const formatOpeningHours = (availability: { days: string[]; times: { start: string; end: string }[] }) => {
    if (!availability || !availability.days.length || !availability.times.length) return 'Closed';

    const days =
      availability.days.length > 1
        ? `${availability.days[0]} - ${availability.days[availability.days.length - 1]}`
        : availability.days[0];
    const time = `${availability.times[0].start} - ${availability.times[0].end}`;
    return `${days}: ${time}`;
  };

  return (
    <article key={studio?._id} className="details studio-details">
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={true}
        title={studio?.name}
        subTitle={studio?.city}
      />
      {/* <h1 className="title">{studio?.name}</h1> */}

      <div className="info">
        <h3>Opening Hours</h3>
        <p>{formatOpeningHours(studio?.studioAvailability || { days: [], times: [] })}</p>
        <small className="city">{studio?.city}</small>
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
