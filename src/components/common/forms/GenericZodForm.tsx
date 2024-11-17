import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Stack, Button } from '@mui/material';
import { z } from 'zod';

export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select' | 'multiselect' | 'number';

interface Field {
  name: string;
  label: string;
  type: FieldType;
  validation?: z.ZodTypeAny;
  options?: string[];
  onChange?: (value: any) => void;
}

interface GenericFormProps {
  title?: string;
  fields: Field[];
  schema: z.ZodObject<any>;
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
  className?: string;
  btnTxt?: string;
}

export const GenericZodForm = ({
  title,
  fields,
  schema,
  defaultValues,
  onSubmit,
  className,
  btnTxt = 'Submit'
}: GenericFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const renderField = (field: Field) => {
    const error = errors[field.name]?.message as string;

    switch (field.type) {
      case 'checkbox':
        return <FormControlLabel control={<Checkbox {...register(field.name)} />} label={field.label} />;

      case 'select':
      case 'multiselect':
        return (
          <div className="select-wrapper">
            <label htmlFor={field.name}>{field.label}</label>
            <Select
              multiple={field.type === 'multiselect'}
              value={watch(field.name) || (field.type === 'multiselect' ? [] : '')}
              onChange={(e) => {
                setValue(field.name, e.target.value);
                field.onChange?.(e.target.value);
              }}
              fullWidth
              error={!!error}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <TextField
            multiline
            rows={4}
            label={field.label}
            {...register(field.name)}
            error={!!error}
            helperText={error}
            fullWidth
          />
        );

      default:
        return (
          <TextField
            type={field.type}
            label={field.label}
            {...register(field.name)}
            error={!!error}
            helperText={error}
            fullWidth
          />
        );
    }
  };

  return (
    <section className={className}>
      {title && <h2>{title}</h2>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <div key={field.name}>{renderField(field)}</div>
          ))}
        </Stack>
        <Button type="submit">{btnTxt}</Button>
      </form>
    </section>
  );
};
