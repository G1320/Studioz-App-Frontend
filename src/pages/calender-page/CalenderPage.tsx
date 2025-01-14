import { useEffect, useMemo, useState } from 'react';
import { useUserContext } from '@contexts/UserContext';
import Item from 'src/types/item';
import Studio from 'src/types/studio';
import { GenericCarousel, GenericList } from '@components/common';
import { StudioPreview } from '@components/entities';
import { useStudioReservations } from '@hooks/dataFetching/useStudioReservations';
import ReservationCalendar from '@components/calender/ReservationCalendar';

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

  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  // const userItems = useMemo(() => {
  //   if (!user?._id) return [];
  //   return items.filter((item) => item.createdBy === user._id);
  // }, [items, user?._id]);

  const renderItem = (studio: Studio) => (
    <div onClick={() => handleStudioSelect(studio)}>
      <StudioPreview studio={studio} navActive={false}></StudioPreview>
    </div>
  );

  return (
    <div>
      <h1>Studio Calendar</h1>
      <div>
        {userStudios.length > 5 ? (
          <GenericCarousel data={userStudios} renderItem={renderItem} />
        ) : (
          <GenericList data={userStudios} renderItem={renderItem} />
        )}
        {selectedStudio && (
          <ReservationCalendar
            title={selectedStudio.name.en}
            studioAvailability={selectedStudio.studioAvailability}
            studioReservations={studioReservations}
          />
        )}
      </div>
    </div>
  );
};

export default StudioCalendarPage;
