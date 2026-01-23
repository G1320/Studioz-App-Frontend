import { useState, useMemo, useCallback, useEffect } from 'react';
import { LockClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@shared/components/icons';
import { MuiDateTimePicker, Button } from '@shared/components';
import { HourSelector } from '@features/entities/items/components/HourSelector';
import { Dialog, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { splitDateTime } from '@shared/utils/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { reserveStudioTimeSlots } from '@shared/services/booking-service';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

type BlockMode = 'timeSlot' | 'singleDay' | 'dateRange';

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
  const [blockMode, setBlockMode] = useState<BlockMode>('timeSlot');
  
  // Date range state
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);
  const [selectingRangeStart, setSelectingRangeStart] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState<Dayjs>(dayjs());
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { t, i18n } = useTranslation(['common', 'studio']);
  const isRTL = i18n.language === 'he';

  // Legacy support: map old blockEntireDay to new mode system
  const blockEntireDay = blockMode === 'singleDay';

  // Sync date-only value when switching modes
  useEffect(() => {
    if (blockMode === 'singleDay' && selectedDate) {
      setSelectedDateOnly(dayjs(selectedDate));
    } else if (blockMode === 'timeSlot' && selectedDateOnly) {
      // When switching back to datetime, preserve the date but let user pick time
      setSelectedDate(selectedDateOnly.hour(11).minute(0).toDate());
    }
  }, [blockMode]);

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

  // Date range handlers
  const handleRangeDayClick = useCallback((date: Dayjs) => {
    if (selectingRangeStart) {
      setRangeStart(date);
      setRangeEnd(null);
      setSelectingRangeStart(false);
    } else {
      // Ensure start is before end
      if (date.isBefore(rangeStart)) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelectingRangeStart(true);
    }
  }, [selectingRangeStart, rangeStart]);

  // Get dates in range that are allowed by studio availability
  const getDatesInRange = useCallback((start: Dayjs, end: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dayName = current.locale('en').format('dddd') as DayOfWeek;
      if (studioAvailability?.days.includes(dayName)) {
        dates.push(current);
      }
      current = current.add(1, 'day');
    }
    return dates;
  }, [studioAvailability]);

  // Count of days to block in range
  const daysToBlock = useMemo(() => {
    if (!rangeStart || !rangeEnd) return 0;
    return getDatesInRange(rangeStart, rangeEnd).length;
  }, [rangeStart, rangeEnd, getDatesInRange]);

  // Validate and show confirmation for date range
  const handleBlockRangeClick = () => {
    if (!rangeStart || !rangeEnd) {
      return toast.error(t('studio:errors.select_date_range', 'Please select a date range'));
    }

    const datesToBlock = getDatesInRange(rangeStart, rangeEnd);
    if (datesToBlock.length === 0) {
      return toast.error(t('studio:errors.no_available_days', 'No available days in selected range'));
    }

    setShowConfirmation(true);
  };

  // Execute the actual date range blocking
  const executeBlockRange = async () => {
    if (!rangeStart || !rangeEnd) return;

    const openingTime = studioAvailability?.times[0]?.start;
    const closingTime = studioAvailability?.times[0]?.end;
    if (!closingTime || !openingTime) {
      return toast.error(t('studio:errors.closing_time_unavailable'));
    }

    const datesToBlock = getDatesInRange(rangeStart, rangeEnd);

    try {
      setIsLoading(true);
      setShowConfirmation(false);
      let successCount = 0;
      let failCount = 0;

      for (const date of datesToBlock) {
        try {
          const bookingDate = date.format('DD/MM/YYYY');
          await reserveStudioTimeSlots({
            studioId,
            bookingDate,
            startTime: openingTime,
            hours: entireDayHours
          });
          successCount++;
        } catch {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(t('studio:success.range_blocked_successfully', { 
          count: successCount,
          defaultValue: '{{count}} days blocked successfully' 
        }));
      }
      if (failCount > 0) {
        toast.warning(t('studio:errors.some_days_failed', { 
          count: failCount,
          defaultValue: '{{count}} days failed to block' 
        }));
      }

      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
      resetForm();
    } catch (error) {
      toast.error(t('studio:errors.block_failed'));
      console.error('Error blocking time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockTime = async () => {
    // Handle date range blocking - show confirmation first
    if (blockMode === 'dateRange') {
      handleBlockRangeClick();
      return;
    }

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
      resetForm();
    } catch (error) {
      toast.error(t('studio:errors.block_failed'));
      console.error('Error blocking time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedDateOnly(null);
    setSelectedHours(1);
    setReason('');
    setBlockMode('timeSlot');
    setRangeStart(null);
    setRangeEnd(null);
    setSelectingRangeStart(true);
    setShowConfirmation(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      if (open === undefined) {
        setIsOpen(false);
      }
      onClose?.();
      resetForm();
    }
  };

  // Render the date range calendar
  const renderDateRangeCalendar = () => {
    const startOfMonth = calendarMonth.startOf('month');
    const endOfMonth = calendarMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();
    const today = dayjs().startOf('day');

    const days: (Dayjs | null)[] = [];

    // Empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(calendarMonth.date(i));
    }

    const isInRange = (date: Dayjs) => {
      if (!rangeStart || !rangeEnd) return false;
      return date.isAfter(rangeStart.subtract(1, 'day')) && date.isBefore(rangeEnd.add(1, 'day'));
    };

    const isSelected = (date: Dayjs) => {
      if (rangeStart && date.isSame(rangeStart, 'day')) return true;
      if (rangeEnd && date.isSame(rangeEnd, 'day')) return true;
      return false;
    };

    const isDisabled = (date: Dayjs) => {
      // Disable past dates
      if (date.isBefore(today)) return true;
      // Disable days not in studio availability
      const dayName = date.locale('en').format('dddd') as DayOfWeek;
      return !studioAvailability?.days.includes(dayName);
    };

    const weekdays = isRTL 
      ? ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <div className="block-range-calendar">
        <div className="block-range-calendar__header">
          <button
            type="button"
            className="block-range-calendar__nav-btn"
            onClick={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}
          >
            {isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <span className="block-range-calendar__month-label">
            {calendarMonth.format('MMMM YYYY')}
          </span>
          <button
            type="button"
            className="block-range-calendar__nav-btn"
            onClick={() => setCalendarMonth(calendarMonth.add(1, 'month'))}
          >
            {isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        <div className="block-range-calendar__weekdays">
          {weekdays.map((day, idx) => (
            <div key={idx} className="block-range-calendar__weekday">{day}</div>
          ))}
        </div>

        <div className="block-range-calendar__days">
          {days.map((date, index) => (
            <div key={index} className="block-range-calendar__day-cell">
              {date && (
                <button
                  type="button"
                  disabled={isDisabled(date)}
                  className={`block-range-calendar__day 
                    ${isSelected(date) ? 'block-range-calendar__day--selected' : ''} 
                    ${isInRange(date) ? 'block-range-calendar__day--in-range' : ''}
                    ${isDisabled(date) ? 'block-range-calendar__day--disabled' : ''}`}
                  onClick={() => handleRangeDayClick(date)}
                >
                  {date.date()}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="block-range-calendar__hint">
          {selectingRangeStart 
            ? t('studio:select_start_date', 'Select start date')
            : t('studio:select_end_date', 'Select end date')}
        </div>

        {rangeStart && rangeEnd && (
          <div className="block-range-calendar__summary">
            {t('studio:will_block_days', { 
              count: daysToBlock,
              start: rangeStart.format('DD/MM'),
              end: rangeEnd.format('DD/MM'),
              defaultValue: 'Will block {{count}} days ({{start}} - {{end}})'
            })}
          </div>
        )}
      </div>
    );
  };

  // Compute if the block button should be disabled
  const isBlockDisabled = useMemo(() => {
    if (isLoading) return true;
    if (blockMode === 'timeSlot') return !selectedDate;
    if (blockMode === 'singleDay') return !selectedDateOnly;
    if (blockMode === 'dateRange') return !rangeStart || !rangeEnd || daysToBlock === 0;
    return true;
  }, [isLoading, blockMode, selectedDate, selectedDateOnly, rangeStart, rangeEnd, daysToBlock]);

  // Get button label
  const getBlockButtonLabel = () => {
    if (isLoading) {
      if (blockMode === 'dateRange') {
        return t('studio:blocking_days', 'Blocking days...');
      }
      return t('studio:blocking');
    }
    if (blockMode === 'dateRange') {
      return daysToBlock > 0 
        ? t('studio:block_days_count', { count: daysToBlock, defaultValue: 'Block {{count}} Days' })
        : t('studio:block_range', 'Block Range');
    }
    if (blockMode === 'singleDay') return t('studio:block_day', 'Block Day');
    return t('studio:block_time');
  };

  // Confirmation screen for date range blocking
  const renderConfirmation = () => (
    <div className="modal-content block-confirmation">
      <div className="block-confirmation__icon">⚠️</div>
      <h2>{t('studio:confirm_block_range', 'Confirm Block Range')}</h2>
      
      <div className="block-confirmation__details">
        <p className="block-confirmation__message">
          {t('studio:confirm_block_message', 'You are about to block the following dates:')}
        </p>
        
        <div className="block-confirmation__range">
          <span className="block-confirmation__date">{rangeStart?.format('DD/MM/YYYY')}</span>
          <span className="block-confirmation__separator">→</span>
          <span className="block-confirmation__date">{rangeEnd?.format('DD/MM/YYYY')}</span>
        </div>
        
        <div className="block-confirmation__count">
          {t('studio:total_days_to_block', { 
            count: daysToBlock,
            defaultValue: '{{count}} days will be blocked' 
          })}
        </div>

        <p className="block-confirmation__warning">
          {t('studio:block_warning', 'Blocked days cannot be booked by customers. You can unblock them later from the calendar view.')}
        </p>
      </div>
      
      <div className="modal-actions">
        <Button 
          onClick={() => setShowConfirmation(false)} 
          className="cancel-button" 
          disabled={isLoading}
        >
          {t('common:cancel')}
        </Button>
        <Button 
          onClick={executeBlockRange} 
          className="block-button block-button--confirm" 
          disabled={isLoading}
        >
          {isLoading ? t('studio:blocking_days', 'Blocking days...') : t('studio:confirm_block', 'Yes, Block These Days')}
        </Button>
      </div>
    </div>
  );

  // Shared modal content
  const renderModalContent = () => {
    if (showConfirmation) {
      return renderConfirmation();
    }

    return (
    <div className="modal-content">
      <h2>{t('studio:block_time')}</h2>

      {/* Mode selector */}
      <RadioGroup
        value={blockMode}
        onChange={(e) => setBlockMode(e.target.value as BlockMode)}
        className="block-mode-selector"
      >
        <FormControlLabel
          value="timeSlot"
          control={<Radio disabled={isLoading} />}
          label={t('studio:block_time_slot', 'Block Time Slot')}
        />
        <FormControlLabel
          value="singleDay"
          control={<Radio disabled={isLoading} />}
          label={t('studio:block_entire_day', 'Block Entire Day')}
        />
        <FormControlLabel
          value="dateRange"
          control={<Radio disabled={isLoading} />}
          label={t('studio:block_date_range', 'Block Date Range')}
        />
      </RadioGroup>

      {/* Hour selector for time slot mode */}
      {blockMode === 'timeSlot' && (
        <div className="block-section">
          <label className="block-section__label">{t('studio:duration', 'Duration')}</label>
          <HourSelector
            value={selectedHours}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            min={1}
          />
        </div>
      )}

      {/* Info text for entire day blocking - wrapped in block-section for consistent height */}
      {blockMode === 'singleDay' && (
        <div className="block-section">
          <label className="block-section__label">{t('studio:duration', 'Duration')}</label>
          <div className="entire-day-info">
            {entireDayHours > 0 ? t('studio:will_block_hours', { 
              hours: entireDayHours, 
              start: studioAvailability?.times[0]?.start,
              end: studioAvailability?.times[0]?.end
            }) : t('studio:select_date', 'Select a date')}
          </div>
        </div>
      )}

      {/* Date pickers based on mode */}
      {blockMode === 'timeSlot' && (
        <div className="block-section">
          <label className="block-section__label">{t('studio:date_and_time', 'Date & Time')}</label>
          <MuiDateTimePicker 
            value={selectedDate} 
            onChange={handleDateChange} 
            studioAvailability={studioAvailability}
            label=""
          />
        </div>
      )}

      {blockMode === 'singleDay' && (
        <div className="block-section">
          <label className="block-section__label">{t('studio:select_date', 'Select Date')}</label>
          <div className="date-picker-container" dir={isRTL ? 'rtl' : 'ltr'}>
            <DatePicker
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
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-primary)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-hover)'
              },
              '& .MuiPickersDay-daySelected, & .MuiPickersDay-today': {
                backgroundColor: 'var(--color-brand)',
                color: 'var(--btn-primary-text)'
              },
              '& .Mui-disabled': {
                color: 'var(--text-disabled)'
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'none',
                dir: isRTL ? 'rtl' : 'ltr',
                error: false,
                placeholder: isRTL ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
                InputProps: {
                  sx: {
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    '& input': {
                      textAlign: 'start',
                      paddingInlineEnd: '8px'
                    }
                  }
                }
              }
            }}
            slots={{
              leftArrowIcon: isRTL ? ChevronRightIcon : ChevronLeftIcon,
              rightArrowIcon: isRTL ? ChevronLeftIcon : ChevronRightIcon
            }}
          />
          </div>
        </div>
      )}

      {blockMode === 'dateRange' && (
        <div className="block-section">
          <label className="block-section__label">{t('studio:select_date_range', 'Select Date Range')}</label>
          {renderDateRangeCalendar()}
        </div>
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
          disabled={isBlockDisabled}
        >
          {getBlockButtonLabel()}
        </Button>
      </div>
    </div>
  );
  };

  // If onClose is provided, this is a controlled component - don't render the trigger button
  if (onClose !== undefined) {
    return (
      <Dialog open={isModalOpen} onClose={handleClose} className="block-time-modal">
        {renderModalContent()}
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
        {renderModalContent()}
      </Dialog>
    </>
  );
};
