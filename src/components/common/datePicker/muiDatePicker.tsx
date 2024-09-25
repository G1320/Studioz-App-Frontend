import { useEffect, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs'; 
import customParseFormat from 'dayjs/plugin/customParseFormat';


dayjs.extend(customParseFormat);


interface MuiDatePickerProps {
  label: string;
  value: Date | null; 
  onChange: (newValue: Date | null) => void;
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
        format="DD/MM/YY"
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
              '&:focus': {
                borderColor: '#fff',
            },
              '& .MuiInputAdornment-root': {
                border: '2px solid #fff !important',
                borderRadius: '6px !important', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1) !important', // Optional hover effect
                },
                '& .MuiSvgIcon-root': {
                    color: '#fff !important',
                },
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
