import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery } from '@components/index';
import { Studio } from 'src/types/index';
import { usePrefetchStudio } from '@hooks/prefetching/index';
import { useLanguageNavigate } from '@hooks/utils';
import { useTranslation } from 'react-i18next';

interface StudioPreviewProps {
  studio?: Studio;
  navActive?: boolean;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ studio, navActive = true }) => {
  const langNavigate = useLanguageNavigate();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');
  const { i18n } = useTranslation();

  const getServicesText = (count: number) => {
    return i18n.language === 'he' ? `שירותים זמינים: ${count}` : `Services Available: ${count}`;
  };

  return (
    <article
      onMouseEnter={prefetchStudio}
      onClick={() => (navActive ? langNavigate(`/studio/${studio?._id}`) : null)}
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
        <h3 className="title">{studio?.name?.en}</h3>
        <small className="city">{studio?.city}</small>
      </div>
      <p className="description">{studio?.description?.en}</p>
      <div className="options-wrapper">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <span
            id="occupancy"
            aria-label={`Maximum occupancy for ${studio?.name?.en}: ${studio?.maxOccupancy || 0} people`}
          >
            {studio?.maxOccupancy || 0}
          </span>
        </div>
        <div role="group" aria-labelledby="smoking">
          <SmokingRooms aria-label="Smoking icon" />
          <span
            id="smoking"
            aria-label={`Smoking allowed at ${studio?.name?.en}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}
          >
            {studio?.isSmokingAllowed ? <Check /> : <Close />}
          </span>
        </div>
        <div role="group" aria-labelledby="accessible">
          <Accessible aria-label="Wheelchair accessible icon" />
          <span
            id="accessible"
            aria-label={`Wheelchair accessible at ${studio?.name.en}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
          >
            {studio?.isWheelchairAccessible ? <Check /> : <Close />}
          </span>
        </div>

        <small>{getServicesText(studio?.items.length || 0)}</small>
      </div>
    </article>
  );
};
