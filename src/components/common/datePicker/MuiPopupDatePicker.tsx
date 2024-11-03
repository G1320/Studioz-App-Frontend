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
}

export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
  ({ label, value, onChange, onAccept, onClose, availability = [], open }, ref) => {
    const pickerRef = useRef<any>(null);
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0)
    );
    const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
    const [hours, setHours] = useState<number>(1);

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
      open: () => pickerRef.current?.open?.()
    }));

    const handleAccept = useCallback(() => {
      if (internalValue) {
        setIsDurationDialogOpen(true); // Open the duration dialog
      }
    }, [internalValue]);

    const handleDurationConfirm = () => {
      onAccept(internalValue?.toDate().toString() || null, hours);
      setIsDurationDialogOpen(false);
      onClose();
    };

    const handleChange = useCallback(
      (newValue: Dayjs | null) => {
        setInternalValue(newValue);
        onChange(newValue ? newValue.toDate() : null);
      },
      [onChange]
    );

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
          open={open}
          onClose={onClose}
          onAccept={handleAccept}
          slotProps={{
            actionBar: { actions: ['cancel', 'accept'] },
            textField: { sx: { display: 'none' } },
            popper: { sx: { zIndex: 1300 } }
          }}
        />
        {/* Duration Confirmation Dialog */}
        <Dialog open={isDurationDialogOpen} onClose={() => setIsDurationDialogOpen(false)}>
          <DialogTitle>Select Booking Duration</DialogTitle>
          <DialogContent>
            <TextField
              type="number"
              label="Hours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              inputProps={{ min: 1, max: 12 }}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDurationDialogOpen(false)}>Cancel</Button>
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

// import { useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
// import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
// import dayjs, { Dayjs } from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(customParseFormat);

// interface MuiDateTimePickerProps {
//   label: string;
//   value: Date | null;
//   onChange: (newValue: Date | null) => void;
//   onAccept: (newValue: string | null) => void;
//   onClose: () => void;
//   open: boolean;
//   availability?: { date: string; times: string[] }[];
// }

// export interface MuiDateTimePickerRef {
//   open: () => void;
// }

// export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
//   ({ label, value, onChange, onAccept, onClose, availability = [], open }, ref) => {
//     const pickerRef = useRef<any>(null);
//     const [internalValue, setInternalValue] = useState<Dayjs | null>(() => {
//       return value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0).second(0);
//     });

//     const shouldDisableDate = (date: Dayjs | null) => {
//       return availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
//     };

//     const shouldDisableTime = (value: Dayjs, view: TimeView) => {
//       const selectedDate = value.format('DD/MM/YYYY');
//       const availableSlot = availability.find((slot) => slot.date === selectedDate);

//       if (!availableSlot) return false; // Enable time selection if no availability data for the date

//       if (view === 'hours') {
//         const bookedHours = availableSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
//         // Disable hour if it does not exist in available times
//         return !bookedHours.includes(value.hour());
//       }

//       if (view === 'minutes') {
//         const bookedMinutes = availableSlot.times.map((t) => dayjs(t, 'HH:mm').minute());
//         // Disable minute if it does not exist in available times for the selected hour
//         return !bookedMinutes.includes(value.minute());
//       }

//       return false; // Do not disable seconds
//     };

//     useImperativeHandle(ref, () => ({
//       open: () => {
//         if (pickerRef.current && pickerRef.current.open) {
//           pickerRef.current.open();
//         }
//       }
//     }));

//     const handleAccept = useCallback(() => {
//       if (internalValue) {
//         onAccept(internalValue.toDate().toString());
//         onClose();
//       }
//     }, [internalValue, onClose, onAccept]);

//     const handleChange = useCallback(
//       (newValue: Dayjs | null) => {
//         setInternalValue(newValue);
//         onChange(newValue ? newValue.toDate() : null);
//       },
//       [onChange]
//     );

//     const handleClose = useCallback(() => {
//       onClose();
//     }, [onClose]);

//     return (
//       <DateTimePicker
//         ref={pickerRef}
//         label={label}
//         value={internalValue}
//         onChange={handleChange}
//         format="DD/MM/YYYY HH:mm"
//         views={['year', 'month', 'day', 'hours']}
//         disablePast={true}
//         shouldDisableDate={shouldDisableDate}
//         shouldDisableTime={shouldDisableTime}
//         closeOnSelect={false}
//         minutesStep={30}
//         ampm={false}
//         open={open}
//         onClose={handleClose}
//         slotProps={{
//           actionBar: {
//             actions: ['cancel', 'accept']
//           },
//           textField: {
//             sx: { display: 'none' }
//           },
//           popper: {
//             sx: { zIndex: 1300 }
//           }
//         }}
//         onAccept={handleAccept}
//       />
//     );
//   }
// );

// MuiDateTimePicker.displayName = 'MuiDateTimePicker';

// import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
// import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
// import dayjs, { Dayjs } from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(customParseFormat);

// interface MuiDateTimePickerProps {
//   label: string;
//   value: Date | null;
//   onChange: (newValue: Date | null) => void;
//   onAccept: (newValue: string | null, hours: number) => void;
//   onClose: () => void;
//   open: boolean;
//   availability?: { date: string; times: string[] }[];
// }

// export interface MuiDateTimePickerRef {
//   open: () => void;
// }

// export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
//   ({ label, value, onChange, onAccept, onClose, availability = [], open }, ref) => {
//     const pickerRef = useRef<any>(null);
//     const [internalValue, setInternalValue] = useState<Dayjs | null>(
//       value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0)
//     );
//     const [isDurationDialogOpen, setIsDurationDialogOpen] = useState(false);
//     const [hours, setHours] = useState<number>(1);

//     const shouldDisableDate = (date: Dayjs | null) => availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));

//     const shouldDisableTime = (value: Dayjs, view: TimeView) => {
//       const selectedDate = value.format('DD/MM/YYYY');
//       const availableSlot = availability.find((slot) => slot.date === selectedDate);
//       if (!availableSlot) return false;
//       if (view === 'hours') {
//         const bookedHours = availableSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
//         return !bookedHours.includes(value.hour());
//       }
//       if (view === 'minutes') {
//         const bookedMinutes = availableSlot.times.map((t) => dayjs(t, 'HH:mm').minute());
//         return !bookedMinutes.includes(value.minute());
//       }
//       return false;
//     };

//     useImperativeHandle(ref, () => ({
//       open: () => pickerRef.current?.open?.()
//     }));

//     const handleAccept = useCallback(() => {
//       if (internalValue) {
//         setIsDurationDialogOpen(true); // Open the duration dialog
//       }
//     }, [internalValue]);

//     const handleDurationConfirm = () => {
//       onAccept(internalValue?.toDate().toString() || null, hours);
//       setIsDurationDialogOpen(false);
//       onClose();
//     };

//     const handleChange = useCallback(
//       (newValue: Dayjs | null) => {
//         setInternalValue(newValue);
//         onChange(newValue ? newValue.toDate() : null);
//       },
//       [onChange]
//     );

//     return (
//       <>
//         <DateTimePicker
//           ref={pickerRef}
//           label={label}
//           value={internalValue}
//           onChange={handleChange}
//           format="DD/MM/YYYY HH:mm"
//           views={['year', 'month', 'day', 'hours']}
//           disablePast
//           shouldDisableDate={shouldDisableDate}
//           shouldDisableTime={shouldDisableTime}
//           closeOnSelect={false}
//           minutesStep={30}
//           ampm={false}
//           open={open}
//           onClose={onClose}
//           onAccept={handleAccept}
//           slotProps={{
//             actionBar: { actions: ['cancel', 'accept'] },
//             textField: { sx: { display: 'none' } },
//             popper: { sx: { zIndex: 1300 } }
//           }}
//         />
//         {/* Duration Confirmation Dialog */}
//         <Dialog open={isDurationDialogOpen} onClose={() => setIsDurationDialogOpen(false)}>
//           <DialogTitle>Select Booking Duration</DialogTitle>
//           <DialogContent>
//             <TextField
//               type="number"
//               label="Hours"
//               value={hours}
//               onChange={(e) => setHours(Number(e.target.value))}
//               inputProps={{ min: 1, max: 12 }}
//               fullWidth
//               margin="dense"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setIsDurationDialogOpen(false)}>Cancel</Button>
//             <Button onClick={handleDurationConfirm} color="primary">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </>
//     );
//   }
// );

// MuiDateTimePicker.displayName = 'MuiDateTimePicker';

// // import { useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
// // import { DateTimePicker, TimeView } from '@mui/x-date-pickers';
// // import dayjs, { Dayjs } from 'dayjs';
// // import customParseFormat from 'dayjs/plugin/customParseFormat';

// // dayjs.extend(customParseFormat);

// // interface MuiDateTimePickerProps {
// //   label: string;
// //   value: Date | null;
// //   onChange: (newValue: Date | null) => void;
// //   onAccept: (newValue: string | null) => void;
// //   onClose: () => void;
// //   open: boolean;
// //   availability?: { date: string; times: string[] }[];
// // }

// // export interface MuiDateTimePickerRef {
// //   open: () => void;
// // }

// // export const MuiDateTimePicker = forwardRef<MuiDateTimePickerRef, MuiDateTimePickerProps>(
// //   ({ label, value, onChange, onAccept, onClose, availability = [], open }, ref) => {
// //     const pickerRef = useRef<any>(null);
// //     const [internalValue, setInternalValue] = useState<Dayjs | null>(() => {
// //       return value ? dayjs(value) : dayjs().add(1, 'day').hour(13).minute(0).second(0);
// //     });

// //     const shouldDisableDate = (date: Dayjs | null) => {
// //       return availability.some((slot) => dayjs(slot.date).isSame(date, 'day'));
// //     };

// //     const shouldDisableTime = (value: Dayjs, view: TimeView) => {
// //       const selectedDate = value.format('DD/MM/YYYY');
// //       const availableSlot = availability.find((slot) => slot.date === selectedDate);

// //       if (!availableSlot) return false; // Enable time selection if no availability data for the date

// //       if (view === 'hours') {
// //         const bookedHours = availableSlot.times.map((t) => dayjs(t, 'HH:mm').hour());
// //         // Disable hour if it does not exist in available times
// //         return !bookedHours.includes(value.hour());
// //       }

// //       if (view === 'minutes') {
// //         const bookedMinutes = availableSlot.times.map((t) => dayjs(t, 'HH:mm').minute());
// //         // Disable minute if it does not exist in available times for the selected hour
// //         return !bookedMinutes.includes(value.minute());
// //       }

// //       return false; // Do not disable seconds
// //     };

// //     useImperativeHandle(ref, () => ({
// //       open: () => {
// //         if (pickerRef.current && pickerRef.current.open) {
// //           pickerRef.current.open();
// //         }
// //       }
// //     }));

// //     const handleAccept = useCallback(() => {
// //       if (internalValue) {
// //         onAccept(internalValue.toDate().toString());
// //         onClose();
// //       }
// //     }, [internalValue, onClose, onAccept]);

// //     const handleChange = useCallback(
// //       (newValue: Dayjs | null) => {
// //         setInternalValue(newValue);
// //         onChange(newValue ? newValue.toDate() : null);
// //       },
// //       [onChange]
// //     );

// //     const handleClose = useCallback(() => {
// //       onClose();
// //     }, [onClose]);

// //     return (
// //       <DateTimePicker
// //         ref={pickerRef}
// //         label={label}
// //         value={internalValue}
// //         onChange={handleChange}
// //         format="DD/MM/YYYY HH:mm"
// //         views={['year', 'month', 'day', 'hours']}
// //         disablePast={true}
// //         shouldDisableDate={shouldDisableDate}
// //         shouldDisableTime={shouldDisableTime}
// //         closeOnSelect={false}
// //         minutesStep={30}
// //         ampm={false}
// //         open={open}
// //         onClose={handleClose}
// //         slotProps={{
// //           actionBar: {
// //             actions: ['cancel', 'accept']
// //           },
// //           textField: {
// //             sx: { display: 'none' }
// //           },
// //           popper: {
// //             sx: { zIndex: 1300 }
// //           }
// //         }}
// //         onAccept={handleAccept}
// //       />
// //     );
// //   }
// // );

// // MuiDateTimePicker.displayName = 'MuiDateTimePicker';
