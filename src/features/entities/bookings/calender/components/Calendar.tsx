import React, { useEffect, useMemo, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import heLocale from '@fullcalendar/core/locales/he';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { useTranslation } from 'react-i18next';
import Reservation from 'src/types/reservation';
import { ReservationCard } from '@features/entities/reservations';
import { GenericModal } from '@shared/components';

interface CalendarProps {
  title?: string;
  studioAvailability?: StudioAvailability;
  studioReservations?: Reservation[];
}

interface EventPopupInfo {
  title: string;
  start: string;
  end: string;
  reservationId: string;
  customerName: string;
  customerPhone: string;
  comment?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ title, studioAvailability, studioReservations = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventPopupInfo | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    setSelectedEvent(null);
  }, [studioReservations]);

  // Close popup immediately
  const handleClosePopup = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Find the selected reservation from studioReservations
  const selectedReservation = useMemo(() => {
    if (!selectedEvent) return null;
    return studioReservations.find((reservation) => reservation._id === selectedEvent.reservationId) || null;
  }, [selectedEvent, studioReservations]);

  const getDayNumber = (day: DayOfWeek): number => {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(day);
  };

  // Convert reservations to calendar events
  const events: EventInput[] = useMemo(() => {
    return studioReservations
      .filter((reservation) => reservation.status === 'confirmed')
      .map((reservation) => {
        // Calculate start and end times based on booking date and time slots
        const baseDate = reservation.bookingDate.split('/').reverse().join('-');
        const startTime = reservation.timeSlots[0];
        const endTime = reservation.timeSlots[reservation.timeSlots.length - 1];
        const endHour = parseInt(endTime.split(':')[0]) + 1;
        const finalEndTime = `${String(endHour).padStart(2, '0')}:00`;

        return {
          title: `${reservation.itemName.en}`,
          start: `${baseDate}T${startTime}`,
          end: `${baseDate}T${finalEndTime}`,
          reservationId: reservation._id,
          backgroundColor: 'rgb(16, 185, 129)',
          borderColor: 'rgb(16, 185, 129)',
          classNames: ['booking-event'],
          extendedProps: {
            customerName: reservation.customerName,
            customerPhone: reservation.customerPhone,
            comment: reservation.comment
          }
        };
      });
  }, [studioReservations]);

  const closedDayNumbers = useMemo(() => {
    if (!studioAvailability?.days) return [];
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return allDays
      .map((day, index) => ({ day, index }))
      .filter(({ day }) => !studioAvailability.days.includes(day))
      .map(({ index }) => index);
  }, [studioAvailability?.days]);

  const businessHours = useMemo(() => {
    if (!studioAvailability) return [];

    return studioAvailability.days.map((day, index) => {
      const times = studioAvailability.times[index];
      return {
        daysOfWeek: [getDayNumber(day)],
        startTime: times.start,
        endTime: times.end
      };
    });
  }, [studioAvailability]);

  return (
    <div className="studio-calendar">
      {title && <h2 className="calendar-title">{title}</h2>}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="listWeek"
        timeZone="local"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={events}
        locale={i18n.language === 'he' ? heLocale : undefined}
        businessHours={businessHours}
        selectable={false}
        dayMaxEvents={true}
        weekends={studioAvailability?.days.includes('Saturday') || studioAvailability?.days.includes('Sunday')}
        dayCellClassNames={(arg) => {
          return closedDayNumbers.includes(arg.date.getDay()) ? 'closed-day' : '';
        }}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        slotDuration="01:00:00"
        expandRows={true}
        stickyHeaderDates={true}
        eventDisplay="block"
        eventClick={(info) => {
          setSelectedEvent({
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            reservationId: info.event.extendedProps.reservationId,
            customerName: info.event.extendedProps.customerName,
            customerPhone: info.event.extendedProps.customerPhone,
            comment: info.event.extendedProps.comment
          });
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
      {selectedEvent && selectedReservation && (
        <GenericModal open={!!selectedEvent} onClose={handleClosePopup} className="calendar-event-modal">
          <ReservationCard reservation={selectedReservation} variant="itemCard" />
        </GenericModal>
      )}
    </div>
  );
};
