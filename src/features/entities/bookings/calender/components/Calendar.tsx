import React, { useMemo, useState } from 'react';
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

interface CalendarProps {
  title?: string;
  studioAvailability?: StudioAvailability;
  studioReservations?: Reservation[];
}

interface EventPopupInfo {
  title: string;
  start: string;
  end: string;
  customerName: string;
  customerPhone: string;
  comment?: string;
  position: { x: number; y: number };
}

export const Calendar: React.FC<CalendarProps> = ({ title, studioAvailability, studioReservations = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventPopupInfo | null>(null);
  const { i18n } = useTranslation();

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
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
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
          const rect = info.el.getBoundingClientRect();
          setSelectedEvent({
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            customerName: info.event.extendedProps.customerName,
            customerPhone: info.event.extendedProps.customerPhone,
            comment: info.event.extendedProps.comment,
            position: {
              x: rect.left + window.scrollX,
              y: rect.bottom + window.scrollY
            }
          });
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
      {selectedEvent && (
        <>
          <div className="event-popup-backdrop" onClick={() => setSelectedEvent(null)} />
          <div
            className="event-popup"
            style={{
              left: `${selectedEvent.position.x}px`,
              top: `${selectedEvent.position.y}px`
            }}
          >
            <button className="close-button" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
            <h3>{selectedEvent.customerName}</h3>
            <p>Phone: {selectedEvent.customerPhone}</p>
            <p>
              Time: {new Date(selectedEvent.start).toLocaleTimeString()} -
              {new Date(selectedEvent.end).toLocaleTimeString()}
            </p>
            {selectedEvent.comment && <p>Notes: {selectedEvent.comment}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;
