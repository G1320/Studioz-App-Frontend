import { useRef, useEffect } from 'react';
import { Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface MuiDateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  onAccept: (newValue: Date | null) => void;
}

export const MuiFullDateTimePicker: React.FC<MuiDateTimePickerProps> = ({
  label,
  value,
  onChange,
  onAccept,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.style.display = 'none';
      anchorRef.current.offsetHeight;
      anchorRef.current.style.display = '';
    }
  }, []);

  return (
    <Stack spacing={4} sx={{ width: '250px' }} ref={anchorRef}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue: Dayjs | null) => onChange(newValue ? newValue.toDate() : null)}
        onAccept={(newValue: Dayjs | null) => onAccept(newValue ? newValue.toDate() : null)}
        format="DD/MM/YY HH:00"
        views={["year", "month", "day", "hours"]}
        minutesStep={60}
        slotProps={{
          textField: (params) => ({
            ...params,
            fullWidth: true,
            sx: {
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#fff' },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#fff' },
                '& .MuiInputAdornment-root': {
                  border: '2px solid #fff',
                  borderRadius: '6px',
                  '& .MuiSvgIcon-root': { color: '#fff' },
                },
              },
            },
          }),
        }}
      />
    </Stack>
  );
};