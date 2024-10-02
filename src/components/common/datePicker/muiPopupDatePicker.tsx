import { useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onAccept: (newValue: Date | null) => void;
  onClose: () => void
  open: boolean;
  availability?: { date: string; times: string[] }[]; 
}

export interface MuiDateTimePickerRef {
  open: () => void;
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept,onClose, availability = [], open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(() => {
      // Set default value to tomorrow at 5 PM if value is null
      return value ? dayjs(value) : dayjs().add(1, 'day').hour(17).minute(0).second(0);
    });

    const shouldDisableDate = (date: Dayjs | null) => {
      return availability.some(
        (slot) => dayjs(slot.date).isSame(date, 'day')
      );
    };

    // Helper function to disable booked times
    const shouldDisableTime = (value: Dayjs, view: TimeView) => {
      if (!value) return false;
      
      const selectedDate = dayjs(value).format('YYYY-MM-DD');
      const unavailableSlot = availability.find((slot) => slot.date === selectedDate);
      
      if (!unavailableSlot) return false;
    
      if (view === 'hours') {
        const bookedHours = unavailableSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
        return bookedHours.includes(value.hour());
      }
    
      if (view === 'minutes') {
        const bookedMinutes = unavailableSlot.times.map((t) => dayjs(t, 'HH:mm').minute());
        return bookedMinutes.includes(value.minute());
      }
    
      return view === 'seconds' ? false : false;
    };
    

    useImperativeHandle(ref, () => ({
      open: () => {
        if (pickerRef.current && pickerRef.current.open) {
          pickerRef.current.open();
        }
      },
    }));

    const handleAccept = useCallback(() => {
      if (internalValue) {
        onAccept(internalValue.toDate());
        onClose();
      }
    }, [internalValue, onClose, onAccept]);

    const handleChange = useCallback((newValue: Dayjs | null) => {
      setInternalValue(newValue);
      onChange(newValue ? newValue.toDate() : null);
    }, [onChange]);

    const handleClose = useCallback(() => {
      onClose(); 
    }, [onClose]);

    return (
      <DateTimePicker
        ref={pickerRef}
        label={label}
        value={internalValue} 
        onChange={handleChange}
        format="DD/MM/YYYY HH:mm"
        views={['year', 'month', 'day', 'hours']}
        disablePast={true}
        shouldDisableDate={shouldDisableDate}
        shouldDisableTime={shouldDisableTime}
        closeOnSelect={false}
        minutesStep={30}
        ampm={false}
        open={open}
        onClose={handleClose}
        slotProps={{
          actionBar: {
            actions: ['cancel', 'accept'],
          },
          textField: {
            sx: { display: 'none' },
          },
          popper: {
            sx: { zIndex: 1300 },
          },
        }}
        onAccept={handleAccept}
      />
    );
  }
);



