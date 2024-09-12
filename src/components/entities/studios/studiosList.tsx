import React from 'react';
import { GenericList } from '../../common/index';
import StudioPreview from './studioPreview';
import { Studio } from '../../../types/index';
interface StudiosListProps {
  studios: Studio[];
}

const StudiosList: React.FC<StudiosListProps> = ({ studios }) => {
  
  const renderItem = (studio: Studio) => <StudioPreview studio={studio} />;

  return (
    <section className="studios">
      <GenericList
        data={studios}
        renderItem={renderItem}
        className="studios-list"
      />
    </section>
  );
};

export default StudiosList;
