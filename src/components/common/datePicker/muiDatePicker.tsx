import { Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs'; 
import { useEffect, useState } from 'react';

interface MuiDatePickerProps {
  label: string;
  value: Date | null; // The parent component will pass a Date object
  onChange: (newValue: Date | null) => void; // The parent expects Date, not Dayjs
}

export const MuiDatePicker: React.FC<MuiDatePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<Dayjs | null>(null);

  // Sync internal Dayjs state with the external Date state
  useEffect(() => {
    if (value) {
      setInternalValue(dayjs(value)); // Convert Date to Dayjs
    } else {
      setInternalValue(null);
    }
  }, [value]);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.toDate()); // Convert Dayjs back to Date before passing to the parent
    } else {
      onChange(null);
    }
  };

  return (
    <Stack spacing={4} sx={{ width: '250px' }}>
      <DatePicker
      className='generic-date-picker'
        label={label}
        slots={{
          textField: (params) => <TextField
          {...params}
          sx={{
            '& .MuiInputBase-input': {
                color: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#fff',
              },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#fff', 
              },
              '&:hover fieldset': {
                borderColor: '#fff', 
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fff', 
              },
            },
          }}
        />,
        }}
        value={internalValue}
        onChange={handleChange} 
      />
    </Stack>
  );
};
