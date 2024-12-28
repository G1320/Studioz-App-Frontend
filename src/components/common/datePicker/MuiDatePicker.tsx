import { useState, useCallback, useEffect } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  availability: { date: string; times: string[] }[];
  studioAvailability?: StudioAvailability;
}

export const MuiDateTimePicker = ({
  label,
  value,
  onChange,
  availability = [],
  studioAvailability
}: MuiDateTimePickerProps) => {
  const [internalValue, setInternalValue] = useState<Dayjs | null>(
    value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0)
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollToInitialTime = () => {
        const list = document.querySelector("[role='listbox'].MuiDigitalClock-list");
        if (list) {
          const items = list.querySelectorAll('.MuiDigitalClock-item');
          const targetHour = Array.from(items).find((item) => item.textContent?.includes('12:'));

          if (targetHour) {
            targetHour.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      };

      // Try multiple times as the dialog might take time to render
      const timer = setTimeout(scrollToInitialTime, 100);
      const timer2 = setTimeout(scrollToInitialTime, 200);
      const timer3 = setTimeout(scrollToInitialTime, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const shouldDisableDate = (date: Dayjs) => {
    // First check if the date is in booked availability
    const isBooked = availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
    if (isBooked) return true;

    // Then check if the day is allowed in studio availability
    const dayName = date.format('dddd') as DayOfWeek;
    const isAllowedDay = studioAvailability?.days.includes(dayName);
    return !isAllowedDay;
  };

  const shouldDisableTime = (value: Dayjs, view: TimeView) => {
    if (view === 'minutes') return false;

    // Check studio hours first
    const studioTimes = studioAvailability?.times[0];
    if (studioTimes) {
      const startHour = dayjs(studioTimes.start, 'HH:mm').hour();
      const endHour = dayjs(studioTimes.end, 'HH:mm').hour();
      if (value.hour() < startHour || value.hour() >= endHour) return true;
    }

    // Then check availability
    const selectedDate = value.format('DD/MM/YYYY');
    const bookedSlot = availability.find((slot) => slot.date === selectedDate);
    if (bookedSlot) {
      return !bookedSlot.times.includes(value.format('HH:00'));
    }

    return false;
  };

  const handleChange = useCallback(
    (newValue: Dayjs | null) => {
      setInternalValue(newValue);
      onChange(newValue ? newValue.toDate() : null);
    },
    [onChange]
  );

  return (
    <DateTimePicker
      label={label}
      value={internalValue}
      onChange={handleChange}
      format="DD/MM/YYYY HH:mm"
      views={['year', 'month', 'day', 'hours']}
      disablePast
      shouldDisableDate={shouldDisableDate}
      shouldDisableTime={shouldDisableTime}
      minutesStep={60}
      ampm={false}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      timeSteps={{ hours: 1, minutes: 60 }}
      desktopModeMediaQuery="@media (min-width: 0px)"
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          color: '#fff'
        },
        '& .MuiInputLabel-root': {
          color: '#fff'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#fff'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#fff'
        },
        '& .MuiSvgIcon-root': {
          color: '#fff'
        },
        '& .MuiPickersDay-daySelected, & .MuiPickersDay-today': {
          backgroundColor: '#fff',
          color: '#000'
        },
        '& .MuiButtonBase-root': {
          color: '#fff'
        },
        '& .Mui-disabled': {
          color: '#bbb'
        }
      }}
      slotProps={{
        textField: { fullWidth: true, margin: 'dense' }
      }}
    />
  );
};
