import { useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
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
}

export interface MuiDateTimePickerRef {
  open: () => void;
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept,onClose, open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(() => {
      // Set default value to tomorrow at 5 PM if value is null
      return value ? dayjs(value) : dayjs().add(1, 'day').hour(17).minute(0).second(0);
    });

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



