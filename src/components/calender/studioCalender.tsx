// StudioCalendar.tsx
import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; // Add this import

import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import StudioItem from 'src/types/studioItem';
import Item from 'src/types/item';

interface StudioCalendarProps {
  title?: string;
  items?: Item[];
  studioItems?: StudioItem[];
  studioAvailability?: StudioAvailability;
}

interface EventPopupInfo {
  title: string;
  start: string;
  end: string;
  itemName: { en: string; he?: string };
  position: { x: number; y: number };
}

const StudioCalendar: React.FC<StudioCalendarProps> = ({ items = [], studioItems = [], studioAvailability, title }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventPopupInfo | null>(null);

  const getDayNumber = (day: DayOfWeek): number => {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(day);
  };

  const generateItemColor = (itemId: string) => {
    const colors = [
      { bg: '#3b82f6', border: '#2563eb' }, // Blue
      { bg: '#10b981', border: '#059669' }, // Green
      { bg: '#f59e0b', border: '#d97706' }, // Yellow
      { bg: '#ef4444', border: '#dc2626' }, // Red
      { bg: '#8b5cf6', border: '#7c3aed' }, // Purple
      { bg: '#ec4899', border: '#db2777' } // Pink
    ];

    // Use the itemId to consistently pick a color
    const index = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // First, filter items that belong to this studio
  const studioFilteredItems = useMemo(() => {
    return items.filter((item) => studioItems.some((studioItem) => studioItem.itemId === item._id));
  }, [items, studioItems]);

  // Then create events from the filtered items' availability
  const events: EventInput[] = useMemo(() => {
    if (!studioFilteredItems) return [];

    return studioFilteredItems.flatMap((item) => {
      if (!item.availability) return [];

      const itemColor = generateItemColor(item._id);

      return item.availability.flatMap((slot) => {
        // Create an array of all possible hours in a day
        const allHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

        // Find the booked hours (ones not in the availability)
        const bookedHours = allHours.filter((hour) => !slot.times.includes(hour));

        // Group consecutive booked hours
        const bookedSlots: { start: string; end: string }[] = [];
        let currentSlot: { start: string; end: string } | null = null;

        bookedHours.forEach((hour) => {
          const currentHour = parseInt(hour);

          if (!currentSlot) {
            currentSlot = { start: hour, end: `${String(currentHour + 1).padStart(2, '0')}:00` };
          } else {
            const lastHour = parseInt(currentSlot.end);
            if (currentHour === lastHour) {
              currentSlot.end = `${String(currentHour + 1).padStart(2, '0')}:00`;
            } else {
              bookedSlots.push(currentSlot);
              currentSlot = { start: hour, end: `${String(currentHour + 1).padStart(2, '0')}:00` };
            }
          }
        });

        if (currentSlot) {
          bookedSlots.push(currentSlot);
        }

        // Convert the grouped slots to events
        return bookedSlots.map(({ start, end }) => ({
          title: `${item.name.en}`,
          start: `${slot.date.split('/').reverse().join('-')}T${start}`,
          end: `${slot.date.split('/').reverse().join('-')}T${end}`,
          backgroundColor: itemColor.bg,
          borderColor: itemColor.border,
          classNames: ['booking-event'],
          extendedProps: {
            itemId: item._id,
            itemName: item.name
          }
        }));
      });
    });
  }, [studioFilteredItems]);

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
        businessHours={businessHours}
        selectable={true}
        selectMirror={true}
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
        selectConstraint="businessHours"
        views={{
          listWeek: {
            buttonText: 'List'
          }
        }}
        select={(info) => {
          // Handle new booking selection
          console.log('Selected:', info.startStr, 'to', info.endStr);
        }}
        eventClick={(info) => {
          // Get click position for popup placement
          const rect = info.el.getBoundingClientRect();
          setSelectedEvent({
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            itemName: info.event.extendedProps.itemName,
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
            <h3>{selectedEvent.itemName.en}</h3>
            <p>
              {new Date(selectedEvent.start).toLocaleTimeString()} -{new Date(selectedEvent.end).toLocaleTimeString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StudioCalendar;
