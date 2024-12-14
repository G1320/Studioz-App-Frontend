import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onAccept: (newValue: string | null, hours: number) => void;
  onClose: () => void;
  open: boolean;
  availability?: { date: string; times: string[] }[];
  studioAvailability?: StudioAvailability;
}

export interface MuiDateTimePickerRef {
  open: () => void;
  reopen: () => void;
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept, onClose, availability = [], studioAvailability, open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0)
    );
    const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
    const [hours, setHours] = useState<number>(1);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(open);

    const shouldDisableDate = (date: Dayjs) => {
      // First check if the date is in booked availability
      const isBooked = availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
      if (isBooked) return true;

      // Then check if the day is allowed in studio availability
      const dayName = date.format('dddd') as DayOfWeek;
      const isAllowedDay = studioAvailability?.days.includes(dayName);
      return !isAllowedDay;
    };

    const shouldDisableTime = (value: Dayjs, view: TimeView) => {
      if (view === 'minutes') return false; // Handle only hours

      // First check booked times
      const selectedDate = value.format('DD/MM/YYYY');
      const bookedSlot = availability.find((slot) => slot.date === selectedDate);
      if (bookedSlot) {
        const bookedHours = bookedSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
        if (bookedHours.includes(value.hour())) return true;
      }

      // Then check studio operating hours
      const studioTimes = studioAvailability?.times[0];
      if (studioTimes) {
        const startHour = dayjs(studioTimes.start, 'HH:mm').hour();
        const endHour = dayjs(studioTimes.end, 'HH:mm').hour();
        return value.hour() < startHour || value.hour() >= endHour;
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
          minutesStep={60}
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
