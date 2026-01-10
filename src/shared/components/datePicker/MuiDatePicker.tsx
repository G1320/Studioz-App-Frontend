import { useState, useCallback, useEffect, useMemo } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { useTranslation } from 'react-i18next';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
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
        // Find all time items and look for 12:00
        const items = document.querySelectorAll('.MuiDigitalClock-item');

        if (items.length === 0) return;

        const targetHour = Array.from(items).find((item) => {
          return item.textContent?.trim() === '12:00';
        }) as HTMLElement;

        if (targetHour) {
          // Get the scrollable parent (the ul list)
          const list = targetHour.closest('.MuiDigitalClock-list') as HTMLElement;

          if (list) {
            const itemTop = targetHour.offsetTop;
            const listHeight = list.clientHeight;
            const itemHeight = targetHour.offsetHeight;
            const scrollPosition = itemTop - listHeight / 2 + itemHeight / 2;

            // Smooth scroll to center the item
            list.scrollTo({
              top: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
          }
        }
      };

      // MUI picker needs time to fully render
      const timers = [100, 250, 500, 750, 1000].map((delay) => setTimeout(scrollToInitialTime, delay));

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
        const endHour = dayjs(studioTimes.end, 'HH:mm').hour();
        if (timeValue.hour() < startHour || timeValue.hour() >= endHour) return true;
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
          leftArrowIcon: isRTL ? ArrowForwardIos : ArrowBackIosNew,
          rightArrowIcon: isRTL ? ArrowBackIosNew : ArrowForwardIos
        }}
      />
    </div>
  );
};
