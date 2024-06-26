import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import GenericImageGallery from '../../common/imageGallery/genericImageGallery';
import GenericAudioGallery from '../../common/audioGallery/genericAudioGallery';

const StudioPreview = ({ studio = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isStudioPath = /^\/studio($|\/)/.test(location.pathname);

  return (
    <article
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
      <GenericAudioGallery
        coverAudio={studio?.coverAudioFile}
        audioFiles={studio?.galleryAudioFiles}
        isAudioFilesShown={isStudioPath}
      />
      <div>
        <h2>{studio?.name}</h2>
        <p>{studio?.city}</p>
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

export default StudioPreview;
