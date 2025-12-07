import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
  position: { x: number; y: number };
}

export const Calendar: React.FC<CalendarProps> = ({ title, studioAvailability, studioReservations = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventPopupInfo | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    setSelectedEvent(null);
    setIsClosing(false);
  }, [studioReservations]);

  // Close popup with animation
  const handleClosePopup = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsClosing(false);
    }, 200);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedEvent && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClosePopup();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedEvent) {
        handleClosePopup();
      }
    };

    if (selectedEvent) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedEvent, handleClosePopup]);

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
          const rect = info.el.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const scrollX = window.scrollX;
          const scrollY = window.scrollY;

          // Popup dimensions
          const popupWidth = 420;
          const popupHeight = 350; // More accurate estimate
          const spacing = 12; // Space between event and popup

          // Default: position to the right of the event, vertically centered
          let x = rect.right + scrollX + spacing;
          let y = rect.top + scrollY + rect.height / 2 - popupHeight / 2;

          // If not enough space on the right, position to the left
          if (x + popupWidth > viewportWidth + scrollX - 20) {
            x = rect.left + scrollX - popupWidth - spacing;
          }

          // If not enough space on the left either, center horizontally
          if (x < scrollX + 20) {
            x = scrollX + viewportWidth / 2 - popupWidth / 2;
          }

          // Vertical adjustments - keep popup within viewport
          if (y + popupHeight > viewportHeight + scrollY - 20) {
            y = viewportHeight + scrollY - popupHeight - 20;
          }
          if (y < scrollY + 20) {
            y = scrollY + 20;
          }

          // Ensure popup doesn't go off-screen horizontally
          if (x + popupWidth > viewportWidth + scrollX - 20) {
            x = viewportWidth + scrollX - popupWidth - 20;
          }
          if (x < scrollX + 20) {
            x = scrollX + 20;
          }

          setSelectedEvent({
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            reservationId: info.event.extendedProps.reservationId,
            customerName: info.event.extendedProps.customerName,
            customerPhone: info.event.extendedProps.customerPhone,
            comment: info.event.extendedProps.comment,
            position: { x, y }
          });
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
      {selectedEvent && selectedReservation && (
        <>
          <div
            className={`event-popup-backdrop ${isClosing ? 'closing' : ''}`}
            onClick={handleClosePopup}
            aria-hidden="true"
          />
          <div
            ref={popupRef}
            className={`event-popup ${isClosing ? 'closing' : ''}`}
            style={{
              left: `${selectedEvent.position.x}px`,
              top: `${selectedEvent.position.y}px`
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-popup-title"
          >
            <button className="event-popup-close" onClick={handleClosePopup} aria-label="Close event details">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <ReservationCard reservation={selectedReservation} variant="itemCard" />
          </div>
        </>
      )}
    </div>
  );
};
