import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { GenericImageGallery } from '@components/index';
import { Studio, User } from 'src/types/index';
import { useWishlists } from '@hooks/dataFetching';
import { useLanguageNavigate } from '@hooks/utils';
import StudioOptions from './StudioOptions';
import StudioAvailabilityDisplay from '@components/utility/AvailabilityDropdown';

interface StudioDetailsProps {
  studio?: Studio;
  user: User | null;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio, user }) => {
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const langNavigate = useLanguageNavigate();

  // const formatOpeningHours = (availability: { days: string[]; times: { start: string; end: string }[] }) => {
  //   if (!availability || !availability.days.length || !availability.times.length) return 'Closed';

  //   const days =
  //     availability.days.length > 1
  //       ? `${availability.days[0]} - ${availability.days[availability.days.length - 1]}`
  //       : availability.days[0];
  //   const time = `${availability.times[0].start} - ${availability.times[0].end}`;
  //   return `${days}: ${time}`;
  // };

  const handleGoToEdit = (studioId: string) => (studioId ? langNavigate(`/edit-studio/${studioId}`) : null);
  const handleAddNewService = (studioId: string) =>
    studioId ? langNavigate(`/create-item/${studio?.name.en}/${studioId}`) : null;

  return (
    <article key={studio?._id} className="details studio-details">
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={true}
        title={studio?.name.en}
        subTitle={studio?.city}
      />

      <div className="info-option-container">
        <AccessTimeIcon className="availability-time-icon" />
        {/* <p>{formatOpeningHours(studio?.studioAvailability || { days: [], times: [] })}</p> */}
        <StudioAvailabilityDisplay availability={studio?.studioAvailability || { days: [], times: [] }} />
        <StudioOptions
          studio={studio as Studio}
          user={user as User}
          wishlists={wishlists}
          onEdit={handleGoToEdit}
          onAddNewService={handleAddNewService}
        />
      </div>
      <p className="description">{studio?.description.en}</p>
      <div className="options-wrapper">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <p
            id="occupancy"
            aria-label={`Maximum occupancy for ${studio?.name.en}: ${studio?.maxOccupancy || 0} people`}
          >
            {studio?.maxOccupancy || 0}
          </p>
        </div>
        <div role="group" aria-labelledby="smoking">
          <SmokingRooms aria-label="Smoking icon" />
          <p
            id="smoking"
            aria-label={`Smoking allowed at ${studio?.name.en}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}
          >
            {studio?.isSmokingAllowed ? <Check /> : <Close />}
          </p>
        </div>
        <div role="group" aria-labelledby="accessible">
          <Accessible aria-label="Wheelchair accessible icon" />
          <p
            id="accessible"
            aria-label={`Wheelchair accessible at ${studio?.name.en}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
          >
            {studio?.isWheelchairAccessible ? <Check /> : <Close />}
          </p>
        </div>
      </div>
    </article>
  );
};
