import React from 'react';
import GenericList from '../../common/lists/genericList';
import StudioPreview from './studioPreview';

const StudiosList = ({ studios }) => {
  const renderItem = (studio) => <StudioPreview studio={studio} />;

  return (
    <section className="studios">
      <GenericList data={studios} renderItem={renderItem} className="studios-list" />
    </section>
  );
};

export default StudiosList;
