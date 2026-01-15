/**
 * DateRangePicker Component
 * A dropdown for selecting date ranges for statistics filtering
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarTodayIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@shared/components/icons';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const getPresetRanges = (t: (key: string) => string) => [
  { key: 'today', label: t('dateRange.today'), getDates: () => ({ startDate: dayjs().startOf('day').toDate(), endDate: dayjs().endOf('day').toDate() }) },
  { key: 'yesterday', label: t('dateRange.yesterday'), getDates: () => ({ startDate: dayjs().subtract(1, 'day').startOf('day').toDate(), endDate: dayjs().subtract(1, 'day').endOf('day').toDate() }) },
  { key: 'last7days', label: t('dateRange.last7days'), getDates: () => ({ startDate: dayjs().subtract(6, 'day').startOf('day').toDate(), endDate: dayjs().endOf('day').toDate() }) },
  { key: 'last30days', label: t('dateRange.last30days'), getDates: () => ({ startDate: dayjs().subtract(29, 'day').startOf('day').toDate(), endDate: dayjs().endOf('day').toDate() }) },
  { key: 'thisMonth', label: t('dateRange.thisMonth'), getDates: () => ({ startDate: dayjs().startOf('month').toDate(), endDate: dayjs().endOf('month').toDate() }) },
  { key: 'lastMonth', label: t('dateRange.lastMonth'), getDates: () => ({ startDate: dayjs().subtract(1, 'month').startOf('month').toDate(), endDate: dayjs().subtract(1, 'month').endOf('month').toDate() }) },
  { key: 'last3months', label: t('dateRange.last3months'), getDates: () => ({ startDate: dayjs().subtract(3, 'month').startOf('month').toDate(), endDate: dayjs().endOf('month').toDate() }) },
  { key: 'thisYear', label: t('dateRange.thisYear'), getDates: () => ({ startDate: dayjs().startOf('year').toDate(), endDate: dayjs().endOf('year').toDate() }) },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation('merchantStats');
  const presetRanges = useMemo(() => getPresetRanges(t), [t]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Dayjs>(dayjs());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (preset: ReturnType<typeof getPresetRanges>[0]) => {
    const { startDate, endDate } = preset.getDates();
    onChange({ startDate, endDate, label: preset.label });
    setIsOpen(false);
    setShowCalendar(false);
  };

  const handleCustomClick = () => {
    setShowCalendar(true);
    setSelectingStart(true);
    setTempStart(null);
    setCalendarMonth(dayjs(value.startDate));
  };

  const handleDayClick = (date: Dayjs) => {
    if (selectingStart) {
      setTempStart(date.toDate());
      setSelectingStart(false);
    } else {
      const startDate = tempStart!;
      const endDate = date.toDate();

      // Ensure start is before end
      const [finalStart, finalEnd] = startDate <= endDate
        ? [startDate, endDate]
        : [endDate, startDate];

      const formattedLabel = `${dayjs(finalStart).format('DD/MM/YY')} - ${dayjs(finalEnd).format('DD/MM/YY')}`;
      onChange({ startDate: finalStart, endDate: finalEnd, label: formattedLabel });
      setIsOpen(false);
      setShowCalendar(false);
    }
  };

  const renderCalendar = () => {
    const startOfMonth = calendarMonth.startOf('month');
    const endOfMonth = calendarMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

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
      if (tempStart && !selectingStart) {
        const start = dayjs(tempStart);
        return date.isAfter(start.subtract(1, 'day')) || date.isSame(start, 'day');
      }
      return false;
    };

    const isSelected = (date: Dayjs) => {
      if (tempStart) {
        return date.isSame(dayjs(tempStart), 'day');
      }
      return date.isSame(dayjs(value.startDate), 'day') || date.isSame(dayjs(value.endDate), 'day');
    };

    return (
      <div className="date-range-picker__calendar">
        <div className="date-range-picker__calendar-header">
          <button
            type="button"
            className="date-range-picker__nav-btn"
            onClick={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}
          >
            <ChevronRightIcon />
          </button>
          <span className="date-range-picker__month-label">
            {calendarMonth.format('MMMM YYYY')}
          </span>
          <button
            type="button"
            className="date-range-picker__nav-btn"
            onClick={() => setCalendarMonth(calendarMonth.add(1, 'month'))}
          >
            <ChevronLeftIcon />
          </button>
        </div>

        <div className="date-range-picker__weekdays">
          {[
            t('daysShort.sun'),
            t('daysShort.mon'),
            t('daysShort.tue'),
            t('daysShort.wed'),
            t('daysShort.thu'),
            t('daysShort.fri'),
            t('daysShort.sat')
          ].map((day, idx) => (
            <div key={idx} className="date-range-picker__weekday">{day}</div>
          ))}
        </div>

        <div className="date-range-picker__days">
          {days.map((date, index) => (
            <div key={index} className="date-range-picker__day-cell">
              {date && (
                <button
                  type="button"
                  className={`date-range-picker__day ${isSelected(date) ? 'date-range-picker__day--selected' : ''} ${isInRange(date) ? 'date-range-picker__day--in-range' : ''}`}
                  onClick={() => handleDayClick(date)}
                >
                  {date.date()}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="date-range-picker__calendar-hint">
          {selectingStart ? t('dateRange.selectStart') : t('dateRange.selectEnd')}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker" ref={dropdownRef}>
      <button
        type="button"
        className="date-range-picker__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarTodayIcon className="date-range-picker__icon" />
        <span className="date-range-picker__label">{value.label}</span>
        <ChevronDownIcon className={`date-range-picker__chevron ${isOpen ? 'date-range-picker__chevron--open' : ''}`} />
      </button>

      {isOpen && (
        <div className="date-range-picker__dropdown">
          {!showCalendar ? (
            <div className="date-range-picker__presets">
              {presetRanges.map(preset => (
                <button
                  key={preset.key}
                  type="button"
                  className={`date-range-picker__preset ${value.label === preset.label ? 'date-range-picker__preset--active' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </button>
              ))}
              <div className="date-range-picker__divider" />
              <button
                type="button"
                className="date-range-picker__preset date-range-picker__preset--custom"
                onClick={handleCustomClick}
              >
                {t('dateRange.customRange')}
              </button>
            </div>
          ) : (
            renderCalendar()
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
