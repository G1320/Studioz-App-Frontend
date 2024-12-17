import { useState, useCallback } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  availability?: { date: string; times: string[] }[];
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

  const shouldDisableDate = (date: Dayjs) => {
    // Check if the date is in booked availability
    const isBooked = availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
    if (isBooked) return true;

    // Check if the day is allowed in studio availability
    const dayName = date.format('dddd') as DayOfWeek;
    const isAllowedDay = studioAvailability?.days.includes(dayName);
    return !isAllowedDay;
  };

  const shouldDisableTime = (value: Dayjs, view: TimeView) => {
    if (view === 'minutes') return false; // Handle only hours

    // Check booked times
    const selectedDate = value.format('DD/MM/YYYY');
    const bookedSlot = availability.find((slot) => slot.date === selectedDate);
    if (bookedSlot) {
      const bookedHours = bookedSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
      if (bookedHours.includes(value.hour())) return true;
    }

    // Check studio operating hours
    const studioTimes = studioAvailability?.times[0];
    if (studioTimes) {
      const startHour = dayjs(studioTimes.start, 'HH:mm').hour();
      const endHour = dayjs(studioTimes.end, 'HH:mm').hour();
      return value.hour() < startHour || value.hour() >= endHour;
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
