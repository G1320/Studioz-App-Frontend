import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { GenericImageGallery } from '@shared/components';
import { Studio, User } from 'src/types/index';
import { useWishlists, useGenres } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import StudioOptions from './StudioOptions';
import StudioAvailabilityDisplay from '@shared/utility-components/AvailabilityDropdown';
import AddressDropdown from '@shared/utility-components/AddressDropdown';
import PhoneDropdown from '@shared/utility-components/PhoneDropdown';
import { GenrePreview } from '@features/entities/genres';

interface StudioDetailsProps {
  studio?: Studio;
  user?: User;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio, user }) => {
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { getDisplayByEnglish } = useGenres();

  const langNavigate = useLanguageNavigate();

  // Convert English genre values to display values
  const displayGenres = studio?.genres?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];

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
        <StudioAvailabilityDisplay availability={studio?.studioAvailability || { days: [], times: [] }} />
        {studio?.address && <AddressDropdown address={studio?.address as string} />}
        {studio?.phone && <PhoneDropdown phone={studio?.phone as string} />}
        <StudioOptions
          studio={studio as Studio}
          user={user as User}
          wishlists={wishlists}
          onEdit={handleGoToEdit}
          onAddNewService={handleAddNewService}
        />
      </div>
      <p className="description">{studio?.description.en}</p>
      {displayGenres.length > 0 && (
        <div className="studio-genres">
          {displayGenres.map((genre, index) => (
            <GenrePreview key={index} genre={genre} pathPrefix="studios" />
          ))}
        </div>
      )}
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
