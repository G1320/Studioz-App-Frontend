import '../styles/_index.scss';
import { useEffect, useState } from 'react';
import { useUserContext } from '@core/contexts';
import Item from 'src/types/item';
import Studio from 'src/types/studio';
import { EmptyState, GenericCarousel, GenericList } from '@shared/components';
import { BusinessIcon } from '@shared/components/icons';
import { StudioCard } from '@features/entities/studios/components/StudioCard';
import { useStudioReservations } from '@shared/hooks';
import { Calendar } from '@features/entities/bookings/calender/components/Calendar';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';

interface CalendarPageProps {
  studios: Studio[];
  items: Item[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ studios }) => {
  const { user } = useUserContext();
  const { t } = useTranslation('dashboard');
  const langNavigate = useLanguageNavigate();
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
      <EmptyState
        className="calendar-page-empty-state"
        icon={<BusinessIcon />}
        title={t('emptyState.title')}
        subtitle={t('emptyState.description')}
        hints={[
          { label: t('emptyState.hints.profile') },
          { label: t('emptyState.hints.services') },
          { label: t('emptyState.hints.bookings') }
        ]}
        actionLabel={t('emptyState.createStudio')}
        onAction={() => langNavigate('/studio/create')}
        secondaryActionLabel={t('emptyState.secondaryCta')}
        onSecondaryAction={() => langNavigate('/owner-faq')}
      />
    );
  }

  const renderItem = (studio: Studio) => (
    <div onClick={() => handleStudioSelect(studio)}>
      <StudioCard studio={studio} navActive={false}></StudioCard>
    </div>
  );

  return (
    <div>
      <div>
        {selectedStudio && (
          <Calendar
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

export default CalendarPage;
