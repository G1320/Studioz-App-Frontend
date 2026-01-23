import React, { useState, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/he';
import { useTranslation } from 'react-i18next';
import { StudioAvailability, Studio } from 'src/types/studio';
import Reservation from 'src/types/reservation';
import { ReservationCard } from '@features/entities/reservations';
import { GenericModal } from '@shared/components';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon, LocationIcon, AddIcon } from '@shared/components/icons';

import '../styles/_calendar.scss';

// --- Types ---
type ViewType = 'month' | 'week' | 'day' | 'list';

interface CalendarEvent {
  id: string;
  title: string;
  start: Dayjs;
  end: Dayjs;
  type: 'booking' | 'maintenance' | 'blocked';
  studioName?: string;
  reservation?: Reservation;
}

interface CalendarProps {
  title?: string;
  studioAvailability?: StudioAvailability;
  studioReservations?: Reservation[];
  userStudios?: Studio[];
  onNewEvent?: () => void;
}

// --- Constants ---
const WEEK_DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// --- Utility ---
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

// --- Sub-Components ---

function ViewTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn('studioz-calendar__view-tab', isActive && 'studioz-calendar__view-tab--active')}
    >
      {label}
    </button>
  );
}

function EventCard({
  event,
  view = 'month',
  onClick
}: {
  event: CalendarEvent;
  view?: 'month' | 'week';
  onClick?: () => void;
}) {
  const isMonth = view === 'month';

  if (isMonth) {
    return (
      <div className="studioz-calendar__event-card studioz-calendar__event-card--month" onClick={onClick}>
        <div
          className={cn(
            'studioz-calendar__event-dot',
            event.type === 'maintenance'
              ? 'studioz-calendar__event-dot--maintenance'
              : 'studioz-calendar__event-dot--booking'
          )}
        />
        <span className="studioz-calendar__event-text">
          {event.start.format('HH:mm')} {event.title}
        </span>
      </div>
    );
  }

  // Week/Day view style
  return (
    <div
      className={cn(
        'studioz-calendar__event-card studioz-calendar__event-card--week',
        event.type === 'maintenance'
          ? 'studioz-calendar__event-card--maintenance'
          : 'studioz-calendar__event-card--booking'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'studioz-calendar__event-bar',
          event.type === 'maintenance'
            ? 'studioz-calendar__event-bar--maintenance'
            : 'studioz-calendar__event-bar--booking'
        )}
      />
      <div className="studioz-calendar__event-content">
        <div className="studioz-calendar__event-title">{event.title}</div>
        <div className="studioz-calendar__event-time">
          <ClockIcon sx={{ fontSize: 10 }} />
          {event.start.format('HH:mm')} - {event.end.format('HH:mm')}
        </div>
        {event.studioName && (
          <div className="studioz-calendar__event-location">
            <LocationIcon sx={{ fontSize: 10 }} />
            {event.studioName}
          </div>
        )}
      </div>
    </div>
  );
}

function MonthView({
  currentDate,
  events,
  onEventClick,
  lang
}: {
  currentDate: Dayjs;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  lang: string;
}) {
  const weekDays = lang === 'he' ? WEEK_DAYS_HE : WEEK_DAYS_EN;
  const monthStart = currentDate.startOf('month');
  const monthEnd = currentDate.endOf('month');
  const startDate = monthStart.startOf('week');
  const endDate = monthEnd.endOf('week');

  const rows = [];
  let days = [];
  let day = startDate;

  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isCurrentMonth = day.month() === monthStart.month();
      const isTodayDate = day.isSame(dayjs(), 'day');
      const dayEvents = events.filter((e) => e.start.isSame(cloneDay, 'day'));

      days.push(
        <div
          key={day.toString()}
          className={cn(
            'studioz-calendar__day-cell',
            !isCurrentMonth && 'studioz-calendar__day-cell--other-month',
            isTodayDate && 'studioz-calendar__day-cell--today'
          )}
        >
          <div className="studioz-calendar__day-header">
            <span className={cn('studioz-calendar__day-number', isTodayDate && 'studioz-calendar__day-number--today')}>
              {day.format('D')}
            </span>
          </div>

          <div className="studioz-calendar__day-events">
            {dayEvents.slice(0, 3).map((e) => (
              <EventCard key={e.id} event={e} view="month" onClick={() => onEventClick(e)} />
            ))}
            {dayEvents.length > 3 && <div className="studioz-calendar__more-events">+{dayEvents.length - 3}</div>}
          </div>
        </div>
      );
      day = day.add(1, 'day');
    }
    rows.push(
      <div className="studioz-calendar__week-row" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="studioz-calendar__month-view">
      <div className="studioz-calendar__weekday-header">
        {weekDays.map((dayName, i) => (
          <div key={i} className="studioz-calendar__weekday-cell">
            {dayName}
          </div>
        ))}
      </div>
      <div className="studioz-calendar__month-grid">{rows}</div>
    </div>
  );
}

function WeekView({
  currentDate,
  events,
  onEventClick,
  lang
}: {
  currentDate: Dayjs;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  lang: string;
}) {
  const weekDays = lang === 'he' ? WEEK_DAYS_HE : WEEK_DAYS_EN;
  const start = currentDate.startOf('week');
  const weekDaysArr = Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));

  return (
    <div className="studioz-calendar__week-view">
      {/* Header */}
      <div className="studioz-calendar__week-header">
        <div className="studioz-calendar__time-gutter-header" />
        {weekDaysArr.map((day, i) => {
          const isTodayDate = day.isSame(dayjs(), 'day');
          return (
            <div key={i} className="studioz-calendar__week-day-header">
              <div
                className={cn(
                  'studioz-calendar__week-day-name',
                  isTodayDate && 'studioz-calendar__week-day-name--today'
                )}
              >
                {weekDays[i]}
              </div>
              <div
                className={cn(
                  'studioz-calendar__week-day-number',
                  isTodayDate && 'studioz-calendar__week-day-number--today'
                )}
              >
                {day.format('D')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="studioz-calendar__week-grid-container">
        <div className="studioz-calendar__week-grid">
          {/* Time Column */}
          <div className="studioz-calendar__time-gutter">
            {HOURS.map((hour) => (
              <div key={hour} className="studioz-calendar__time-slot-label">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="studioz-calendar__week-columns">
            {/* Horizontal Lines */}
            <div className="studioz-calendar__hour-lines">
              {HOURS.map((hour) => (
                <div key={hour} className="studioz-calendar__hour-line" />
              ))}
            </div>

            {/* Vertical Lines & Events */}
            {weekDaysArr.map((day, i) => (
              <div key={i} className="studioz-calendar__week-column">
                {events
                  .filter((e) => e.start.isSame(day, 'day'))
                  .map((e) => {
                    const startHour = e.start.hour();
                    const duration = e.end.diff(e.start, 'hour', true);
                    return (
                      <div
                        key={e.id}
                        style={{ top: `${startHour * 60}px`, height: `${duration * 60}px` }}
                        className="studioz-calendar__week-event-wrapper"
                      >
                        <EventCard event={e} view="week" onClick={() => onEventClick(e)} />
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayView({
  currentDate,
  events,
  onEventClick,
  lang
}: {
  currentDate: Dayjs;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  lang: string;
}) {
  const weekDays = lang === 'he' ? WEEK_DAYS_HE : WEEK_DAYS_EN;
  const isTodayDate = currentDate.isSame(dayjs(), 'day');

  return (
    <div className="studioz-calendar__day-view">
      {/* Header */}
      <div className="studioz-calendar__day-view-header">
        <div
          className={cn(
            'studioz-calendar__day-view-weekday',
            isTodayDate && 'studioz-calendar__day-view-weekday--today'
          )}
        >
          {weekDays[currentDate.day()]}
        </div>
        <div className={cn('studioz-calendar__day-view-date', isTodayDate && 'studioz-calendar__day-view-date--today')}>
          {currentDate.format('D MMMM')}
        </div>
      </div>

      {/* Time Grid */}
      <div className="studioz-calendar__day-grid-container">
        <div className="studioz-calendar__day-grid">
          <div className="studioz-calendar__time-gutter">
            {HOURS.map((hour) => (
              <div key={hour} className="studioz-calendar__time-slot-label">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            ))}
          </div>

          <div className="studioz-calendar__day-column">
            <div className="studioz-calendar__hour-lines">
              {HOURS.map((hour) => (
                <div key={hour} className="studioz-calendar__hour-line" />
              ))}
            </div>

            {events
              .filter((e) => e.start.isSame(currentDate, 'day'))
              .map((e) => {
                const startHour = e.start.hour();
                const duration = e.end.diff(e.start, 'hour', true);
                return (
                  <div
                    key={e.id}
                    style={{ top: `${startHour * 60}px`, height: `${duration * 60}px` }}
                    className="studioz-calendar__day-event-wrapper"
                  >
                    <EventCard event={e} view="week" onClick={() => onEventClick(e)} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({
  currentDate,
  events,
  onEventClick,
  t,
  onNewEvent
}: {
  currentDate: Dayjs;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  t: (key: string) => string;
  onNewEvent?: () => void;
}) {
  const dayEvents = events.filter((e) => e.start.isSame(currentDate, 'day'));

  return (
    <div className="studioz-calendar__list-view">
      <div className="studioz-calendar__list-header">
        <h3 className="studioz-calendar__list-title">{t('calendar.agenda')}</h3>
        <div className="studioz-calendar__list-date">{currentDate.format('D MMMM YYYY')}</div>
      </div>

      {dayEvents.length > 0 ? (
        <div className="studioz-calendar__list-events">
          {dayEvents.map((e) => (
            <div key={e.id} className="studioz-calendar__list-event" onClick={() => onEventClick(e)}>
              <div className="studioz-calendar__list-event-time">
                <div className="studioz-calendar__list-event-start">{e.start.format('HH:mm')}</div>
                <div className="studioz-calendar__list-event-end">{e.end.format('HH:mm')}</div>
              </div>
              <div className="studioz-calendar__list-event-content">
                <div className="studioz-calendar__list-event-header">
                  <h3 className="studioz-calendar__list-event-title">{e.title}</h3>
                  <div
                    className={cn(
                      'studioz-calendar__list-event-dot',
                      e.type === 'maintenance'
                        ? 'studioz-calendar__list-event-dot--maintenance'
                        : 'studioz-calendar__list-event-dot--booking'
                    )}
                  />
                </div>
                <div className="studioz-calendar__list-event-meta">
                  {e.studioName && (
                    <span className="studioz-calendar__list-event-tag">
                      <LocationIcon sx={{ fontSize: 12 }} /> {e.studioName}
                    </span>
                  )}
                  <span className="studioz-calendar__list-event-tag">
                    <ClockIcon sx={{ fontSize: 12 }} /> {e.end.diff(e.start, 'minute')} {t('calendar.minutes')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="studioz-calendar__empty-state">
          <CalendarIcon sx={{ fontSize: 48 }} className="studioz-calendar__empty-icon" />
          <p className="studioz-calendar__empty-text">{t('calendar.noEvents')}</p>
          <button className="studioz-calendar__empty-action" onClick={onNewEvent}>{t('calendar.addEvent')} +</button>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export const Calendar: React.FC<CalendarProps> = ({
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studioAvailability: _studioAvailability,
  studioReservations = [],
  userStudios = [],
  onNewEvent
}) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  // Set dayjs locale
  dayjs.locale(lang === 'he' ? 'he' : 'en');

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState<ViewType>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Convert reservations to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return studioReservations
      .filter((reservation) => reservation.status === 'confirmed')
      .map((reservation) => {
        const baseDate = reservation.bookingDate.split('/').reverse().join('-');
        const startTime = reservation.timeSlots[0];
        const endTime = reservation.timeSlots[reservation.timeSlots.length - 1];
        const endHour = parseInt(endTime.split(':')[0]) + 1;
        const finalEndTime = `${String(endHour).padStart(2, '0')}:00`;

        return {
          id: reservation._id,
          title: reservation.itemName?.en || reservation.itemName?.he || 'Booking',
          start: dayjs(`${baseDate}T${startTime}`),
          end: dayjs(`${baseDate}T${finalEndTime}`),
          type: 'booking' as const,
          studioName: reservation.studioName?.en || reservation.studioName?.he,
          reservation
        };
      });
  }, [studioReservations]);

  const handlePrev = useCallback(() => {
    if (view === 'month') setCurrentDate(currentDate.subtract(1, 'month'));
    else if (view === 'week') setCurrentDate(currentDate.subtract(1, 'week'));
    else setCurrentDate(currentDate.subtract(1, 'day'));
  }, [view, currentDate]);

  const handleNext = useCallback(() => {
    if (view === 'month') setCurrentDate(currentDate.add(1, 'month'));
    else if (view === 'week') setCurrentDate(currentDate.add(1, 'week'));
    else setCurrentDate(currentDate.add(1, 'day'));
  }, [view, currentDate]);

  const handleToday = useCallback(() => setCurrentDate(dayjs()), []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const formatHeaderDate = () => {
    if (view === 'month') return currentDate.format('MMMM YYYY');
    if (view === 'day' || view === 'list') return currentDate.format('D MMMM YYYY');
    // Week range
    const start = currentDate.startOf('week');
    const end = currentDate.endOf('week');
    if (start.month() === end.month()) {
      return `${start.format('D')} - ${end.format('D MMMM YYYY')}`;
    }
    return `${start.format('D MMM')} - ${end.format('D MMM YYYY')}`;
  };

  return (
    <div className="studioz-calendar" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="studioz-calendar__container">
        {/* Top Control Bar */}
        <div className="studioz-calendar__control-bar">
          {/* Left: Title & Nav */}
          <div className="studioz-calendar__nav-section">
            <div className="studioz-calendar__title-group">
              <h1 className="studioz-calendar__main-title">{formatHeaderDate()}</h1>
              <p className="studioz-calendar__subtitle">
                <CalendarIcon sx={{ fontSize: 16 }} />
                {title || t('calendar.occupancyManagement')}
              </p>
            </div>

            <div className="studioz-calendar__nav-buttons">
              <button onClick={handlePrev} className="studioz-calendar__nav-btn">
                {lang === 'he' ? <ChevronRightIcon sx={{ fontSize: 20 }} /> : <ChevronLeftIcon sx={{ fontSize: 20 }} />}
              </button>
              <button onClick={handleToday} className="studioz-calendar__today-btn">
                {t('calendar.today')}
              </button>
              <button onClick={handleNext} className="studioz-calendar__nav-btn">
                {lang === 'he' ? <ChevronLeftIcon sx={{ fontSize: 20 }} /> : <ChevronRightIcon sx={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>

          {/* Right: Actions & View Switcher */}
          <div className="studioz-calendar__actions-section">
            <div className="studioz-calendar__view-tabs">
              <ViewTab label={t('calendar.month')} isActive={view === 'month'} onClick={() => setView('month')} />
              <ViewTab label={t('calendar.week')} isActive={view === 'week'} onClick={() => setView('week')} />
              <ViewTab label={t('calendar.day')} isActive={view === 'day'} onClick={() => setView('day')} />
              <ViewTab label={t('calendar.list')} isActive={view === 'list'} onClick={() => setView('list')} />
            </div>

            <button className="studioz-calendar__add-event-btn" onClick={onNewEvent}>
              <AddIcon sx={{ fontSize: 20 }} />
              <span>{t('calendar.newEvent')}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="studioz-calendar__content">
          {view === 'month' && (
            <MonthView currentDate={currentDate} events={events} onEventClick={handleEventClick} lang={lang} />
          )}
          {view === 'week' && (
            <WeekView currentDate={currentDate} events={events} onEventClick={handleEventClick} lang={lang} />
          )}
          {view === 'day' && (
            <DayView currentDate={currentDate} events={events} onEventClick={handleEventClick} lang={lang} />
          )}
          {view === 'list' && (
            <ListView currentDate={currentDate} events={events} onEventClick={handleEventClick} t={t} onNewEvent={onNewEvent} />
          )}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent?.reservation && (
        <GenericModal open={!!selectedEvent} onClose={handleCloseModal} className="calendar-event-modal">
          <ReservationCard 
            reservation={selectedEvent.reservation} 
            variant="itemCard" 
            userStudios={userStudios}
            onCancel={handleCloseModal}
          />
        </GenericModal>
      )}
    </div>
  );
};

export default Calendar;
