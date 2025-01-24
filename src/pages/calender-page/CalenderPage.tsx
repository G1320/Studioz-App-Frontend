import { useEffect, useState } from 'react';
import { useUserContext } from '@contexts/UserContext';
import Item from 'src/types/item';
import Studio from 'src/types/studio';
import { GenericCarousel, GenericList } from '@components/common';
import { StudioPreview } from '@components/entities';
import { useStudioReservations } from '@hooks/index';
import ReservationCalendar from '@components/calender/ReservationCalendar';
import { Link } from 'react-router-dom';

interface StudioCalendarPageProps {
  studios: Studio[];
  items: Item[];
}

const StudioCalendarPage: React.FC<StudioCalendarPageProps> = ({ studios }) => {
  const { user } = useUserContext();
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(studios[0]);
  const { data: studioReservations } = useStudioReservations(selectedStudio?._id || '');

  useEffect(() => {
    const savedStudioId = localStorage.getItem('selectedCalendarStudioId');
    if (savedStudioId && studios.length) {
      const studio = studios.find((s) => s._id === savedStudioId);
      if (studio) {
        setSelectedStudio(studio);
      }
    }
  }, [studios]);

  useEffect(() => {
    if (!user?._id) {
      setSelectedStudio(null);
      localStorage.removeItem('selectedCalendarStudioId');
    }
  }, [user?._id]);

  const handleStudioSelect = (studio: Studio) => {
    setSelectedStudio(studio);
    localStorage.setItem('selectedCalendarStudioId', studio._id);
  };

  if (!studios.length) {
    return (
      <div>
        <Link to={'/create-studio'}>No studios yet, click here to add your first studio</Link>
      </div>
    );
  }

  const renderItem = (studio: Studio) => (
    <div onClick={() => handleStudioSelect(studio)}>
      <StudioPreview studio={studio} navActive={false}></StudioPreview>
    </div>
  );

  return (
    <div>
      <div>
        {selectedStudio && (
          <ReservationCalendar
            title={selectedStudio.name.en}
            studioAvailability={selectedStudio.studioAvailability}
            studioReservations={studioReservations}
          />
        )}
        {studios.length > 5 ? (
          <GenericCarousel data={studios} renderItem={renderItem} />
        ) : (
          <GenericList data={studios} renderItem={renderItem} />
        )}
      </div>
    </div>
  );
};

export default StudioCalendarPage;
