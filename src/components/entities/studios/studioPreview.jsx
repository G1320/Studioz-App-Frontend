import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';
import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import GenericList from '../../common/lists/genericList';

const StudioPreview = ({ studio = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currImage, setCurrImage] = useState(null);

  const handleImageChange = (image) => {
    setCurrImage(image);
  };

  useEffect(() => {
    setCurrImage(studio?.coverImage);
  }, [studio]);

  const isStudiosPath = location.pathname.includes('studio');

  const renderItem = (image, index) => (
    <img
      onClick={() => handleImageChange(image)}
      className="gallery-image preview"
      key={index}
      src={image}
      alt={studio.name}
    />
  );

  return (
    <article
      onClick={() => navigate(`/studio/${studio?._id}`)}
      key={studio?._id}
      className="preview studio-preview"
    >
      <img src={currImage} alt={studio?.name} />

      {isStudiosPath && studio?.galleryImages && studio.galleryImages.length > 0 && (
        <>
          <GenericList
            data={studio.galleryImages}
            renderItem={renderItem}
            className={'gallery-images-list'}
          />
          <Button onClick={() => navigate(`/edit-studio/${studio?._id}`)}>Edit Studio</Button>
        </>
      )}
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
