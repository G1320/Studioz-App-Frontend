// StudioCalendar.tsx
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import StudioItem from 'src/types/studioItem';
import Item from 'src/types/item';

interface StudioCalendarProps {
  items?: Item[];
  studioItems?: StudioItem[];
  studioAvailability?: StudioAvailability;
}

const StudioCalendar: React.FC<StudioCalendarProps> = ({ items = [], studioItems = [], studioAvailability }) => {
  const getDayNumber = (day: DayOfWeek): number => {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(day);
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
          title: `Booked: ${item.name.en}`,
          start: `${slot.date.split('/').reverse().join('-')}T${start}`,
          end: `${slot.date.split('/').reverse().join('-')}T${end}`,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          classNames: ['booking-event'],
          extendedProps: {
            itemId: item._id,
            itemName: item.name
          }
        }));
      });
    });
  }, [studioFilteredItems]);

  // Convert studioAvailability to FullCalendar business hours
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

  // Custom styling for the calendar
  const calendarStyles = `
    .fc-event {
      cursor: pointer;
    }
    .fc-day-disabled {
      background-color: #f3f4f6;
    }
    .fc-day-today {
      background-color: #dbeafe !important;
    }
    .booking-event {
      border-radius: 4px;
    }
    .fc-toolbar-title {
      font-size: 1.25rem !important;
    }
  `;

  return (
    <div className="studio-calendar">
      <style>{calendarStyles}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        businessHours={businessHours}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={studioAvailability?.days.includes('Saturday') || studioAvailability?.days.includes('Sunday')}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        slotDuration="01:00:00"
        expandRows={true}
        stickyHeaderDates={true}
        nowIndicator={true}
        eventDisplay="block"
        selectConstraint="businessHours"
        hiddenDays={
          studioAvailability?.days
            ? [0, 1, 2, 3, 4, 5, 6].filter(
                (dayNum) =>
                  !studioAvailability.days.includes(
                    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum] as DayOfWeek
                  )
              )
            : []
        }
        select={(info) => {
          // Handle new booking selection
          console.log('Selected:', info.startStr, 'to', info.endStr);
        }}
        eventClick={(info) => {
          // Handle clicking on existing booking
          console.log('Event clicked:', info.event);
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
};

export default StudioCalendar;
