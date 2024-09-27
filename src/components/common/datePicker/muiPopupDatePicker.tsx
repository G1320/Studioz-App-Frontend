import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onAccept: (newValue: Date | null) => void;
  open: boolean;
}

export interface MuiDateTimePickerRef {
  open: () => void;
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept, open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (pickerRef.current && pickerRef.current.open) {
          pickerRef.current.open();
        }
      },
    }));

    // Handle when the user clicks "OK"
    const handleAccept = () => {
      open = true;
      if (internalValue) {
        onAccept(internalValue.toDate());
      }
    };

    return (
      <DateTimePicker 
        ref={pickerRef}
        label={label}
        value={internalValue ? internalValue : value ? dayjs(value) : null}
        onChange={(newValue: Dayjs | null) => {
          setInternalValue(newValue); // Save internally but don't call onAccept yet
          onChange(newValue ? newValue.toDate() : null);
        }}
        format="DD/MM/YYYY HH:mm"
        views={['year', 'month', 'day', 'hours', 'minutes']}
        minutesStep={30}
        ampm={false}
        open={open}
        slotProps={{
          actionBar: {
            actions: ['cancel', 'accept'],
            onAccept: handleAccept, 
          },
          textField: {
            sx: { display: 'none' },
          },
          popper: {
            sx: { zIndex: 1300 },
          },
        }}
      />
    );
  }
);
