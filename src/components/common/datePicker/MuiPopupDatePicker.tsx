import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onAccept: (newValue: string | null, hours: number) => void;
  onClose: () => void;
  open: boolean;
  availability?: { date: string; times: string[] }[];
}

export interface MuiDateTimePickerRef {
  open: () => void;
  reopen: () => void;
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept, onClose, availability = [], open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0)
    );
    const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
    const [hours, setHours] = useState<number>(1);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(open);

    const shouldDisableDate = (date: Dayjs | null) => availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));

    const shouldDisableTime = (value: Dayjs, view: TimeView) => {
      const selectedDate = value.format('DD/MM/YYYY');
      const availableSlot = availability.find((slot) => slot.date === selectedDate);
      if (!availableSlot) return false;
      if (view === 'hours') {
        const bookedHours = availableSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
        return !bookedHours.includes(value.hour());
      }
      if (view === 'minutes') {
        const bookedMinutes = availableSlot.times.map((t) => dayjs(t, 'HH:mm').minute());
        return !bookedMinutes.includes(value.minute());
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsDatePickerOpen(true);
        pickerRef.current?.open?.();
      },
      reopen: () => {
        setTimeout(() => {
          setIsDatePickerOpen(true);
          pickerRef.current?.open?.();
        }, 200);
      }
    }));

    const handleAccept = useCallback(() => {
      if (internalValue) {
        setIsDurationDialogOpen(true);
      }
    }, [internalValue]);

    const handleDurationConfirm = () => {
      onAccept(internalValue?.toDate().toString() || null, hours);
      setIsDurationDialogOpen(false);
    };

    const handleChange = useCallback(
      (newValue: Dayjs | null) => {
        setInternalValue(newValue);
        onChange(newValue ? newValue.toDate() : null);
      },
      [onChange]
    );

    const handlePickerClose = () => {
      setIsDatePickerOpen(false);
      onClose();
    };

    const handleDurationDialogClose = () => {
      setIsDurationDialogOpen(false);
      setIsDatePickerOpen(true);
    };

    return (
      <>
        <DateTimePicker
          ref={pickerRef}
          label={label}
          value={internalValue}
          onChange={handleChange}
          format="DD/MM/YYYY HH:mm"
          views={['year', 'month', 'day', 'hours']}
          disablePast
          shouldDisableDate={shouldDisableDate}
          shouldDisableTime={shouldDisableTime}
          closeOnSelect={false}
          minutesStep={30}
          ampm={false}
          open={isDatePickerOpen}
          onClose={handlePickerClose}
          onAccept={handleAccept}
          slotProps={{
            actionBar: { actions: ['cancel', 'accept'] },
            textField: { sx: { display: 'none' } },
            popper: { sx: { zIndex: 1300 } }
          }}
        />
        <Dialog open={isDurationDialogOpen} onClose={handleDurationDialogClose} sx={{ zIndex: 1400 }}>
          <DialogTitle>Select Booking Duration</DialogTitle>
          <DialogContent>
            <TextField
              type="number"
              label="Hours"
              value={hours}
              defaultValue={2}
              onChange={(e) => setHours(Number(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 12,
                  inputMode: 'numeric'
                }
              }}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDurationDialogClose}>Back</Button>
            <Button onClick={handleDurationConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

MuiDateTimePicker.displayName = 'MuiDateTimePicker';
