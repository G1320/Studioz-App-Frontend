import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery } from '@components/index';
import { Studio } from 'src/types/index';
import { usePrefetchStudio } from '@hooks/prefetching/index';
import { useLanguageNavigate } from '@hooks/utils';

interface StudioPreviewProps {
  studio?: Studio;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ studio }) => {
  const langNavigate = useLanguageNavigate();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');

  return (
    <article
      onMouseEnter={prefetchStudio}
      onClick={() => langNavigate(`/studio/${studio?._id}`)}
      key={studio?._id}
      className="preview studio-preview"
    >
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={false}
      />

      <div className="studio-preview-name-and-city">
        <h3 className="title">{studio?.name}</h3>
        <small className="city">{studio?.city}</small>
      </div>
      <p className="description">{studio?.description}</p>
      <div className="options-wrapper">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <span
            id="occupancy"
            aria-label={`Maximum occupancy for ${studio?.name}: ${studio?.maxOccupancy || 0} people`}
          >
            {studio?.maxOccupancy || 0}
          </span>
        </div>
        <div role="group" aria-labelledby="smoking">
          <SmokingRooms aria-label="Smoking icon" />
          <span
            id="smoking"
            aria-label={`Smoking allowed at ${studio?.name}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}
          >
            {studio?.isSmokingAllowed ? <Check /> : <Close />}
          </span>
        </div>
        <div role="group" aria-labelledby="accessible">
          <Accessible aria-label="Wheelchair accessible icon" />
          <span
            id="accessible"
            aria-label={`Wheelchair accessible at ${studio?.name}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
          >
            {studio?.isWheelchairAccessible ? <Check /> : <Close />}
          </span>
        </div>

        <small>Services Available: {studio?.items.length} </small>
      </div>
    </article>
  );
};
