import { useMemo, useState } from 'react';
import StudioCalendar from '@components/calender/studioCalender';
import { useUserContext } from '@contexts/UserContext';
import Item from 'src/types/item';
import Studio from 'src/types/studio';
import { GenericCarousel } from '@components/common';

interface StudioCalendarPageProps {
  studios: Studio[];
  items: Item[];
}

const StudioCalendarPage: React.FC<StudioCalendarPageProps> = ({ studios, items }) => {
  const { user } = useUserContext();
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  console.log('Studio example', studios[0]);
  console.log('Item example', items[0]);

  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  const userItems = useMemo(() => {
    if (!user?._id) return [];
    return items.filter((item) => item.createdBy === user._id);
  }, [items, user?._id]);

  const renderItem = (studio: Studio) => (
    <div onClick={() => setSelectedStudio(studio)}>
      <span>{studio.name.en}</span>
    </div>
  );

  return (
    <div>
      <h1>Studio Calendar</h1>
      <div>
        <GenericCarousel data={userStudios} renderItem={renderItem} />
        {selectedStudio && (
          <StudioCalendar
            studioAvailability={selectedStudio.studioAvailability}
            items={userItems}
            studioItems={selectedStudio.items}
          />
        )}
      </div>
    </div>
  );
};

export default StudioCalendarPage;
