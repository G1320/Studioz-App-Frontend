import { useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import { Switch, Checkbox } from '@headlessui/react';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import dayjs from 'dayjs';
import { useDays } from '@shared/hooks';
import { defaultHours } from './constants';
import { FieldError } from '@shared/validation/components';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';

type Schedule = Record<
  DayOfWeek,
  {
    isOpen: boolean;
    is24Hours: boolean;
    hours: { start: string; end: string };
  }
>;

interface BusinessHoursProps {
  value: StudioAvailability;
  onChange: (value: StudioAvailability) => void;
  error?: string;
  fieldName?: string;
}

const defaultSchedule: Schedule = {
  Sunday: { isOpen: false, is24Hours: false, hours: defaultHours },
  Monday: { isOpen: true, is24Hours: false, hours: defaultHours },
  Tuesday: { isOpen: true, is24Hours: false, hours: defaultHours },
  Wednesday: { isOpen: true, is24Hours: false, hours: defaultHours },
  Thursday: { isOpen: true, is24Hours: false, hours: defaultHours },
  Friday: { isOpen: true, is24Hours: false, hours: defaultHours },
  Saturday: { isOpen: false, is24Hours: false, hours: defaultHours }
};

// Helper to check if times represent 24 hours
const is24HoursTime = (start: string, end: string) => {
  return start === '00:00' && (end === '23:59' || end === '00:00');
};

export const BusinessHours = ({ value, onChange, error, fieldName = 'studioAvailability' }: BusinessHoursProps) => {
  const { getDisplayByEnglish, getEnglishByDisplay } = useDays();
  const { t } = useTranslation('forms');

  // Convert studioAvailability to schedule format
  // Derive is24Hours from the actual times (00:00-23:59 = 24 hours)
  // Note: value.days might contain display names (Hebrew) or English names
  const initialSchedule = Object.fromEntries(
    Object.keys(defaultSchedule).map((day) => {
      // Check if day exists in value.days (handle both English and display name formats)
      const dayDisplay = getDisplayByEnglish(day);
      const isOpen = value.days.includes(day as DayOfWeek) || value.days.includes(dayDisplay);
      
      // Find the day index - check both English and display name
      let dayIndex = value.days.indexOf(day as DayOfWeek);
      if (dayIndex === -1) {
        dayIndex = value.days.indexOf(dayDisplay);
      }
      
      const timeData = dayIndex >= 0 ? value.times[dayIndex] : null;
      const hours = timeData ? { start: timeData.start, end: timeData.end } : defaultHours;
      // Derive is24Hours from the times
      const is24Hours = timeData ? is24HoursTime(timeData.start, timeData.end) : false;
      return [day, { isOpen, is24Hours, hours }];
    })
  ) as Schedule;

  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);

  const handleDayToggle = (day: DayOfWeek) => {
    const updatedSchedule = {
      ...schedule,
      [day]: { ...schedule[day], isOpen: !schedule[day].isOpen }
    };
    setSchedule(updatedSchedule);
    emitChange(updatedSchedule);
  };

  const handle24HoursToggle = (day: DayOfWeek) => {
    const newIs24Hours = !schedule[day].is24Hours;
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        is24Hours: newIs24Hours,
        // When toggling to 24 hours, set times to full day
        hours: newIs24Hours ? { start: '00:00', end: '23:59' } : defaultHours
      }
    };
    setSchedule(updatedSchedule);
    emitChange(updatedSchedule);
  };

  const handleTimeChange = (day: DayOfWeek, type: 'start' | 'end', newTime: dayjs.Dayjs | null) => {
    if (!newTime) return;

    const timeString = newTime.format('HH:mm');
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        hours: { ...schedule[day].hours, [type]: timeString }
      }
    };
    setSchedule(updatedSchedule);
    emitChange(updatedSchedule);
  };

  const emitChange = (updatedSchedule: Schedule) => {
    const days = Object.entries(updatedSchedule)
      .filter(([_, { isOpen }]) => isOpen)
      .map(([day]) => day as DayOfWeek);

    // Only emit start/end times - is24Hours is derived from times (00:00-23:59)
    const times = days.map((day) => ({
      start: updatedSchedule[day].hours.start,
      end: updatedSchedule[day].hours.end
    }));

    onChange({ days, times });
  };

  return (
    <div className={`business-hours ${error ? 'has-error' : ''}`}>
      {(Object.keys(schedule) as DayOfWeek[]).map((day) => (
        <div key={day} className="day-row">
          <div className="day-switch-container">
            <Switch
              checked={schedule[day].isOpen}
              onChange={() => handleDayToggle(day)}
              className={`switch ${schedule[day].isOpen ? 'on' : ''}`}
            />
            <span>{getDisplayByEnglish(day)}</span>
          </div>
          {schedule[day].isOpen && (
            <div className="hours-container">
              {/* 24 Hours Checkbox */}
              <label className="is-24-hours-label">
                <Checkbox
                  checked={schedule[day].is24Hours}
                  onChange={() => handle24HoursToggle(day)}
                  className={`is-24-hours-checkbox ${schedule[day].is24Hours ? 'checked' : ''}`}
                >
                  {schedule[day].is24Hours && <CheckIcon className="check-icon" />}
                </Checkbox>
                <span className="is-24-hours-text">{t('form.studioAvailability.is24Hours', '24H')}</span>
              </label>

              {/* Time pickers - hidden when 24 hours is checked */}
              {!schedule[day].is24Hours && (
                <div className="hours">
                  <TimePicker
                    value={dayjs(schedule[day].hours?.start, 'HH:mm')}
                    onChange={(newTime) => handleTimeChange(day, 'start', newTime)}
                    views={['hours']}
                    format="HH:mm"
                    ampm={false}
                    timeSteps={{ hours: 1, minutes: 60 }}
                    desktopModeMediaQuery="@media (min-width: 0px)"
                  />
                  <span>--</span>
                  <TimePicker
                    value={dayjs(schedule[day].hours?.end, 'HH:mm')}
                    onChange={(newTime) => handleTimeChange(day, 'end', newTime)}
                    views={['hours']}
                    format="HH:mm"
                    ampm={false}
                    timeSteps={{ hours: 1, minutes: 60 }}
                    desktopModeMediaQuery="@media (min-width: 0px)"
                  />
                </div>
              )}

              {/* Show 24 hours indicator when checked */}
              {schedule[day].is24Hours && (
                <div className="hours-24-indicator">
                  <span>00:00 - 23:59</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {error && <FieldError error={error} fieldName={fieldName} />}
    </div>
  );
};
