import { Button } from '@components/index';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Stack } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select';

interface Field {
  name: string;
  label: string;
  type?: FieldType;
  value?: string | number | boolean;
  options?: string[];
}

interface GenericFormProps {
  title?: string;
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  className: string;
  btnTxt?: string;
  onCategoryChange?: (value: string) => void;
}

export const GenericForm: React.FC<GenericFormProps> = ({
  title,
  fields,
  onSubmit,
  className,
  btnTxt = 'Submit',
  onCategoryChange
}) => {
  const { register, handleSubmit, reset } = useForm<Record<string, any>>();

  const onSubmitHandler: SubmitHandler<Record<string, unknown>> = (data) => {
    onSubmit(data);
    reset();
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'category' && onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <section className={`form generic-form ${className}`}>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <div key={field.label} className="checkbox-wrapper">
              {field.type === 'checkbox' ? (
                <FormControlLabel
                  control={<Checkbox id={field.name} {...register(field.name)} />}
                  label={field.label}
                />
              ) : field.type === 'select' ? (
                <div className="select-wrapper">
                  <label htmlFor={field.name}>{field.label}</label>
                  <Select
                    id={field.name}
                    defaultValue=""
                    {...register(field.name)}
                    fullWidth
                    variant="outlined"
                    onChange={handleSelectChange}
                    sx={{
                      color: 'black', // Text color for the select
                      '& .MuiSelect-select': {
                        color: 'black' // Text color for selected option
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black' // Border color
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black' // Border color on hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black' // Border color when focused
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      {field.label}
                    </MenuItem>
                    {field?.options?.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              ) : field.type === 'textarea' ? (
                <TextField
                  id={field.name}
                  label={field.label}
                  defaultValue={field.value}
                  variant="outlined"
                  multiline
                  rows={4}
                  {...register(field.name)}
                  fullWidth
                />
              ) : (
                <TextField
                  id={field.name}
                  label={field.label}
                  defaultValue={field.value}
                  variant="outlined"
                  type={field.type}
                  {...register(field.name)}
                  fullWidth
                />
              )}
            </div>
          ))}
        </Stack>
        <Button type="submit">{btnTxt}</Button>
      </form>
    </section>
  );
};
