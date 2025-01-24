import { useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import { Switch } from '@headlessui/react';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import dayjs from 'dayjs';
import { useDays } from '@shared/hooks/index';

type Schedule = Record<
  DayOfWeek,
  {
    isOpen: boolean;
    hours: { start: string; end: string };
  }
>;

interface BusinessHoursProps {
  value: StudioAvailability;
  onChange: (value: StudioAvailability) => void;
}

export const defaultHours = {
  start: '09:00',
  end: '17:00'
};

const defaultSchedule: Schedule = {
  Sunday: { isOpen: false, hours: defaultHours },
  Monday: { isOpen: true, hours: defaultHours },
  Tuesday: { isOpen: true, hours: defaultHours },
  Wednesday: { isOpen: true, hours: defaultHours },
  Thursday: { isOpen: true, hours: defaultHours },
  Friday: { isOpen: true, hours: defaultHours },
  Saturday: { isOpen: false, hours: defaultHours }
};

export const BusinessHours = ({ value, onChange }: BusinessHoursProps) => {
  const { getDisplayByEnglish } = useDays();

  // Convert studioAvailability to schedule format
  const initialSchedule = Object.fromEntries(
    Object.keys(defaultSchedule).map((day) => {
      const isOpen = value.days.includes(day as DayOfWeek);
      const hours = value.times[value.days.indexOf(day as DayOfWeek)] || defaultHours;
      return [day, { isOpen, hours }];
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

    const times = days.map((day) => updatedSchedule[day].hours);

    onChange({ days, times });
  };

  return (
    <div className="business-hours">
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
        </div>
      ))}
    </div>
  );
};
