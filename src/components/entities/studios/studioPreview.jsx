import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../common/buttons/genericButton';
import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';

const StudioPreview = ({ studio = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isStudiosPath = location.pathname.includes('studios');

  return (
    <article
      onClick={() => navigate(`/studio/${studio?._id}`)}
      key={studio?._id}
      className="preview studio-preview"
    >
      <img src={studio?.imgUrl} alt={studio?.name} />
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
      {isStudiosPath && (
        <Button onClick={() => navigate(`/edit-studio/${studio?._id}`)}>Edit Studio</Button>
      )}
    </article>
  );
};

export default StudioPreview;
