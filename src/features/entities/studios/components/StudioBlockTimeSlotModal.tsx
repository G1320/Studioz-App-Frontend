import { useState, useMemo, useCallback, useEffect } from 'react';
import { LockClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@shared/components/icons';
import { MuiDateTimePicker, Button } from '@shared/components';
import { HourSelector } from '@features/entities/items/components/HourSelector';
import { Dialog, FormControlLabel, Checkbox } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { splitDateTime } from '@shared/utils/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { reserveStudioTimeSlots } from '@shared/services/booking-service';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

interface StudioBlockModalProps {
  studioId: string;
  studioAvailability?: StudioAvailability;
  onClose?: () => void;
  open?: boolean;
}

export const StudioBlockModal: React.FC<StudioBlockModalProps> = ({ studioId, studioAvailability, onClose, open }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use controlled open prop if provided, otherwise use internal state
  const isModalOpen = open !== undefined ? open : isOpen;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateOnly, setSelectedDateOnly] = useState<Dayjs | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blockEntireDay, setBlockEntireDay] = useState(false);
  const { t, i18n } = useTranslation(['common', 'studio']);
  const isRTL = i18n.language === 'he';

  // Sync date-only value when switching modes
  useEffect(() => {
    if (blockEntireDay && selectedDate) {
      setSelectedDateOnly(dayjs(selectedDate));
    } else if (!blockEntireDay && selectedDateOnly) {
      // When switching back to datetime, preserve the date but let user pick time
      setSelectedDate(selectedDateOnly.hour(11).minute(0).toDate());
    }
  }, [blockEntireDay]);

  // For date-only picker: disable dates based on studio availability
  const shouldDisableDateOnly = useCallback(
    (date: Dayjs) => {
      const dayName = date.locale('en').format('dddd') as DayOfWeek;
      const isAllowedDay = studioAvailability?.days.includes(dayName);
      return !isAllowedDay;
    },
    [studioAvailability]
  );

  // Calculate total hours for entire day based on studio availability
  const entireDayHours = useMemo(() => {
    if (!studioAvailability?.times?.[0]) return 0;
    const openingTime = studioAvailability.times[0].start;
    const closingTime = studioAvailability.times[0].end;
    if (!openingTime || !closingTime) return 0;
    
    const [openHour, openMin] = openingTime.split(':').map(Number);
    const [closeHour, closeMin] = closingTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + (openMin || 0);
    const closeMinutes = closeHour * 60 + (closeMin || 0);
    
    return Math.ceil((closeMinutes - openMinutes) / 60);
  }, [studioAvailability]);

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleDateOnlyChange = useCallback(
    (newValue: Dayjs | null) => {
      setSelectedDateOnly(newValue);
    },
    []
  );

  const handleIncrement = () => {
    setSelectedHours((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSelectedHours((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBlockTime = async () => {
    // Use the appropriate date based on mode
    const dateToUse = blockEntireDay ? selectedDateOnly?.toDate() : selectedDate;
    
    if (!dateToUse) {
      return toast.error(t('studio:errors.select_date_time'));
    }

    const { bookingDate } = splitDateTime(dateToUse.toString());
    if (!bookingDate) {
      return toast.error(t('studio:errors.invalid_date_time'));
    }

    const openingTime = studioAvailability?.times[0]?.start;
    const closingTime = studioAvailability?.times[0]?.end;
    if (!closingTime || !openingTime) {
      return toast.error(t('studio:errors.closing_time_unavailable'));
    }

    // Use opening time and full day hours if blocking entire day, otherwise use selected values
    const effectiveStartTime = blockEntireDay ? openingTime : splitDateTime(dateToUse.toString()).startTime;
    const effectiveHours = blockEntireDay ? entireDayHours : selectedHours;

    if (!effectiveStartTime) {
      return toast.error(t('studio:errors.invalid_date_time'));
    }

    if (!blockEntireDay) {
      const startDateTime = dayjs(`${bookingDate} ${effectiveStartTime}`, 'DD/MM/YYYY HH:mm');
      const endDateTime = startDateTime.add(effectiveHours, 'hour');
      const closingDateTime = dayjs(`${bookingDate} ${closingTime}`, 'DD/MM/YYYY HH:mm');

      if (endDateTime.isAfter(closingDateTime)) {
        return toast.error(t('studio:errors.hours_exceed_closing'));
      }
    }

    try {
      setIsLoading(true);

      await reserveStudioTimeSlots({
        studioId,
        bookingDate,
        startTime: effectiveStartTime,
        hours: effectiveHours
      });

      toast.success(blockEntireDay 
        ? t('studio:success.day_blocked_successfully', 'Day blocked successfully')
        : t('studio:success.blocked_successfully')
      );
      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
      setSelectedDate(null);
      setSelectedDateOnly(null);
      setSelectedHours(1);
      setReason('');
      setBlockEntireDay(false);
    } catch (error) {
      toast.error(t('studio:errors.block_failed'));
      console.error('Error blocking time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
      setBlockEntireDay(false);
      setSelectedDateOnly(null);
    }
  };

  // If onClose is provided, this is a controlled component - don't render the trigger button
  if (onClose !== undefined) {
    return (
      <Dialog open={isModalOpen} onClose={handleClose} className="block-time-modal">
        <div className="modal-content">
          <h2>{t('studio:block_time')}</h2>

          <FormControlLabel
            control={
              <Checkbox
                checked={blockEntireDay}
                onChange={(e) => setBlockEntireDay(e.target.checked)}
                disabled={isLoading}
              />
            }
            label={t('studio:block_entire_day', 'Block Entire Day')}
            className="block-entire-day-checkbox"
          />

          {!blockEntireDay && (
            <HourSelector
              value={selectedHours}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              min={1}
            />
          )}

          {blockEntireDay && entireDayHours > 0 && (
            <div className="entire-day-info">
              {t('studio:will_block_hours', { 
                hours: entireDayHours, 
                start: studioAvailability?.times[0]?.start,
                end: studioAvailability?.times[0]?.end
              })}
            </div>
          )}

          {/* Date-only picker for blocking entire day */}
          {blockEntireDay ? (
            <div className="date-picker-container" dir={isRTL ? 'rtl' : 'ltr'}>
              <DatePicker
                label={t('studio:select_date', 'Select date')}
                value={selectedDateOnly}
                onChange={handleDateOnlyChange}
                format={isRTL ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}
                minDate={dayjs()}
                disablePast
                shouldDisableDate={shouldDisableDateOnly}
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
                  leftArrowIcon: isRTL ? ChevronRightIcon : ChevronLeftIcon,
                  rightArrowIcon: isRTL ? ChevronLeftIcon : ChevronRightIcon
                }}
              />
            </div>
          ) : (
            <MuiDateTimePicker 
              value={selectedDate} 
              onChange={handleDateChange} 
              studioAvailability={studioAvailability}
            />
          )}

          <input
            type="text"
            placeholder={t('studio:block_reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reason-input"
            disabled={isLoading}
          />

          <div className="modal-actions">
            <Button onClick={handleClose} className="cancel-button" disabled={isLoading}>
              {t('common:cancel')}
            </Button>
            <Button 
              onClick={handleBlockTime} 
              className="block-button" 
              disabled={(blockEntireDay ? !selectedDateOnly : !selectedDate) || isLoading}
            >
              {isLoading ? t('studio:blocking') : blockEntireDay ? t('studio:block_day', 'Block Day') : t('studio:block_time')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  // Default behavior: render trigger button
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="block-time-button" title={t('studio:block_time')}>
        <LockClockIcon className="clock-icon" />
      </button>

      <Dialog open={isModalOpen} onClose={handleClose} className="block-time-modal">
        <div className="modal-content">
          <h2>{t('studio:block_time')}</h2>

          <FormControlLabel
            control={
              <Checkbox
                checked={blockEntireDay}
                onChange={(e) => setBlockEntireDay(e.target.checked)}
                disabled={isLoading}
              />
            }
            label={t('studio:block_entire_day', 'Block Entire Day')}
            className="block-entire-day-checkbox"
          />

          {!blockEntireDay && (
            <HourSelector
              value={selectedHours}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              min={1}
            />
          )}

          {blockEntireDay && entireDayHours > 0 && (
            <div className="entire-day-info">
              {t('studio:will_block_hours', { 
                hours: entireDayHours, 
                start: studioAvailability?.times[0]?.start,
                end: studioAvailability?.times[0]?.end
              })}
            </div>
          )}

          {/* Date-only picker for blocking entire day */}
          {blockEntireDay ? (
            <div className="date-picker-container" dir={isRTL ? 'rtl' : 'ltr'}>
              <DatePicker
                label={t('studio:select_date', 'Select date')}
                value={selectedDateOnly}
                onChange={handleDateOnlyChange}
                format={isRTL ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}
                minDate={dayjs()}
                disablePast
                shouldDisableDate={shouldDisableDateOnly}
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
                  leftArrowIcon: isRTL ? ChevronRightIcon : ChevronLeftIcon,
                  rightArrowIcon: isRTL ? ChevronLeftIcon : ChevronRightIcon
                }}
              />
            </div>
          ) : (
            <MuiDateTimePicker 
              value={selectedDate} 
              onChange={handleDateChange} 
              studioAvailability={studioAvailability}
            />
          )}

          <input
            type="text"
            placeholder={t('studio:block_reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="reason-input"
            disabled={isLoading}
          />

          <div className="modal-actions">
            <Button onClick={handleClose} className="cancel-button" disabled={isLoading}>
              {t('common:cancel')}
            </Button>
            <Button 
              onClick={handleBlockTime} 
              className="block-button" 
              disabled={(blockEntireDay ? !selectedDateOnly : !selectedDate) || isLoading}
            >
              {isLoading ? t('studio:blocking') : blockEntireDay ? t('studio:block_day', 'Block Day') : t('studio:block_time')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
