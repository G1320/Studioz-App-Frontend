import { useState, useCallback, useEffect, useMemo } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { useTranslation } from 'react-i18next';
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from '@shared/components/icons';
import { Item, Studio } from 'src/types/index';
import {
  AvailabilityContext,
  isDateBookable,
  getAvailableSlotsForDate,
  getMinimumHours,
  getMaxConsecutiveHours,
  getMinBookableDate
} from '@shared/utils/availabilityUtils';
import './_MuiDatePicker.scss';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  itemAvailability?: { date: string; times: string[] }[];
  studioAvailability?: StudioAvailability;
  /** Full item object for advanced availability calculations */
  item?: Item;
  /** Full studio object for advanced availability calculations */
  studio?: Studio;
}

export const MuiDateTimePicker = ({
  value,
  onChange,
  itemAvailability = [],
  studioAvailability,
  item,
  studio
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

  // Create availability context for advanced calculations
  const availabilityContext = useMemo<AvailabilityContext | null>(() => {
    if (!item) return null;
    return {
      item,
      studio
    };
  }, [item, studio]);

  // Calculate minimum bookable date based on advance booking requirement
  const minDate = useMemo(() => {
    if (item) {
      return getMinBookableDate(item);
    }
    return dayjs(); // Default to today
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      const scrollToInitialTime = () => {
        // With CSS reordering, 06:00 is now at the top of the list
        // Just scroll to top to show 06:00 first
        const list = document.querySelector('.MuiDigitalClock-list') as HTMLElement;
        if (list) {
          list.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      };

      // MUI picker needs time to fully render
      const timers = [100, 250].map((delay) => setTimeout(scrollToInitialTime, delay));

      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  const shouldDisableDate = useCallback(
    (date: Dayjs) => {
      // Use advanced availability logic if item is provided
      if (availabilityContext) {
        const result = isDateBookable(date, availabilityContext);
        return !result.isBookable;
      }

      // Fallback to legacy logic
      // First check if the date is in booked availability
      const isBooked = itemAvailability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
      if (isBooked) return true;

      // Get the day name in English for comparison
      const dayName = date.locale('en').format('dddd') as DayOfWeek;
      const isAllowedDay = studioAvailability?.days.includes(dayName);
      return !isAllowedDay;
    },
    [availabilityContext, itemAvailability, studioAvailability]
  );

  const shouldDisableTime = useCallback(
    (timeValue: Dayjs, view: TimeView) => {
      if (view === 'minutes') return false;

      // Use advanced availability logic if item is provided
      if (availabilityContext && internalValue) {
        const selectedDate = internalValue;
        const availableSlots = getAvailableSlotsForDate(selectedDate, availabilityContext);
        const slotStr = timeValue.format('HH:00');

        // Check if slot is available
        if (!availableSlots.includes(slotStr)) {
          return true;
        }

        // Check if slot can accommodate minimum duration
        const minHours = getMinimumHours(availabilityContext.item);
        if (minHours > 1) {
          const maxConsecutive = getMaxConsecutiveHours(slotStr, availableSlots);
          if (maxConsecutive < minHours) {
            return true;
          }
        }

        return false;
      }

      // Fallback to legacy logic
      const dayName = timeValue.locale('en').format('dddd') as DayOfWeek;

      // Get the business hours for the selected day
      const dayIndex = studioAvailability?.days.indexOf(dayName);
      if (dayIndex === undefined || dayIndex === -1) return true;

      const studioTimes = studioAvailability?.times[dayIndex]; // Get the times for the specific day
      if (studioTimes) {
        const startHour = dayjs(studioTimes.start, 'HH:mm').hour();
        const endTime = studioTimes.end;

        // For 23:59, treat as 24:00 (allow 23:00 slot)
        const endHour = endTime === '23:59' ? 24 : dayjs(endTime, 'HH:mm').hour();

        const currentHour = timeValue.hour();

        // Handle wraparound hours (e.g., 17:00 - 06:00)
        if (startHour > endHour) {
          // For overnight ranges, time is valid if it's >= startHour OR < endHour
          if (currentHour < startHour && currentHour >= endHour) return true;
        } else {
          // Normal range: time must be >= startHour AND < endHour
          if (currentHour < startHour || currentHour >= endHour) return true;
        }
      }

      const selectedDate = timeValue.format('DD/MM/YYYY');
      const bookedSlot = itemAvailability.find((slot) => slot.date === selectedDate);
      if (bookedSlot) {
        return !bookedSlot.times.includes(timeValue.format('HH:00'));
      }

      return false;
    },
    [availabilityContext, internalValue, itemAvailability, studioAvailability]
  );

  const handleChange = useCallback(
    (newValue: Dayjs | null) => {
      setInternalValue(newValue);
      onChange(newValue ? newValue.toDate() : null);
    },
    [onChange]
  );

  return (
    <div className="date-picker-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <DateTimePicker
        label={isRTL ? 'בחר תאריך ושעה' : 'Select date and time'}
        value={internalValue}
        onChange={handleChange}
        format={isRTL ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY HH:mm'}
        views={['year', 'month', 'day', 'hours']}
        minDate={minDate}
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
            color: '#fff',
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiInputLabel-root': {
            color: '#fff !important'
          },
          '& .MuiInputLabel-root.Mui-error': {
            color: '#fff !important'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff'
          },
          '& .MuiPickersDay-daySelected, & .MuiPickersDay-today': {
            backgroundColor: '#fff',
            color: '#000'
          },
          '& .Mui-disabled': {
            color: '#bbb'
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'none',
            dir: isRTL ? 'rtl' : 'ltr',
            error: false
          }
        }}
        slots={{
          leftArrowIcon: isRTL ? ArrowForwardIosIcon : ArrowBackIosNewIcon,
          rightArrowIcon: isRTL ? ArrowBackIosNewIcon : ArrowForwardIosIcon
        }}
      />
    </div>
  );
};
