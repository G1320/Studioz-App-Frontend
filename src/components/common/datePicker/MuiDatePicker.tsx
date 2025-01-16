import { useState, useCallback, useEffect } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { useTranslation } from 'react-i18next';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  itemAvailability?: { date: string; times: string[] }[];
  studioAvailability?: StudioAvailability;
}

export const MuiDateTimePicker = ({
  value,
  onChange,
  itemAvailability = [],
  studioAvailability
}: MuiDateTimePickerProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);
  const [internalValue, setInternalValue] = useState<Dayjs | null>(
    value ? dayjs(value) : dayjs().add(1, 'day').hour(11).minute(0)
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
    const isBooked = itemAvailability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
    if (isBooked) return true;

    // Get the day name in English for comparison
    const dayName = date.locale('en').format('dddd') as DayOfWeek;
    const isAllowedDay = studioAvailability?.days.includes(dayName);
    return !isAllowedDay;
  };

  const shouldDisableTime = (value: Dayjs, view: TimeView) => {
    if (view === 'minutes') return false;

    const dayName = value.format('dddd') as DayOfWeek;

    // Get the business hours for the selected day
    const dayIndex = studioAvailability?.days.indexOf(dayName);
    if (dayIndex === undefined || dayIndex === -1) return true;

    const studioTimes = studioAvailability?.times[dayIndex]; // Get the times for the specific day
    if (studioTimes) {
      const startHour = dayjs(studioTimes.start, 'HH:mm').hour();
      const endHour = dayjs(studioTimes.end, 'HH:mm').hour();
      if (value.hour() < startHour || value.hour() >= endHour) return true;
    }

    const selectedDate = value.format('DD/MM/YYYY');
    const bookedSlot = itemAvailability.find((slot) => slot.date === selectedDate);
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
      label={isRTL ? 'בחר תאריך ושעה' : 'Select date and time'}
      value={internalValue}
      onChange={handleChange}
      format={isRTL ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY HH:mm'}
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
        textField: {
          fullWidth: true,
          margin: 'dense',
          dir: isRTL ? 'rtl' : 'ltr'
        }
      }}
      slots={{
        leftArrowIcon: isRTL ? ArrowForwardIos : ArrowBackIosNew,
        rightArrowIcon: isRTL ? ArrowBackIosNew : ArrowForwardIos
      }}
    />
  );
};
