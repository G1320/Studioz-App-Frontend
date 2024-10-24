import { useNavigate, useLocation } from 'react-router-dom';
import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery, GenericAudioGallery } from '@/components';
import { Studio } from '@/types/index';
import { usePrefetchStudio } from '@/hooks/prefetching/index';

interface StudioPreviewProps {
  studio?: Studio;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ studio }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');

  const isStudioPath = /^\/studio($|\/)/.test(location.pathname);

  return (
    <article
      onMouseEnter={prefetchStudio}
      onClick={() => navigate(`/studio/${studio?._id}`)}
      key={studio?._id}
      className="preview studio-preview"
    >
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={isStudioPath}
      />
      {isStudioPath && (
        <GenericAudioGallery
          coverAudioFile={studio?.coverAudioFile}
          audioFiles={studio?.galleryAudioFiles}
          isAudioFilesShown={isStudioPath}
        />
      )}
      <div className="studio-preview-name-and-city">
        <h2>{studio?.name}</h2>
        <small>{studio?.city}</small>
      </div>
      <p>{studio?.description}</p>
      <div className="options-wrapper">
        <ChairIcon />
        <p> {studio?.maxOccupancy || 0}</p>
        <SmokingRooms />
        <p>{studio?.isSmokingAllowed ? <Check /> : <Close />}</p>
        <Accessible />
        <p>{studio?.isWheelchairAccessible ? <Check /> : <Close />}</p>
      </div>
      <h3>{studio?.items.length} Services Available</h3>
    </article>
  );
};
