import React from 'react';
import Button from '../buttons/genericButton';
import { useForm } from 'react-hook-form';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Stack } from '@mui/material';

const GenericForm = ({ title, fields, onSubmit, className, btnTxt = 'Submit', onCategoryChange }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === 'category' && onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <section className={`generic-form ${className}`}>
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
                    style={{ color: '#fff' }}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="" disabled>
                      {field.label}
                    </MenuItem>
                    {field.options.map((option, index) => (
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
                  variant="outlined"
                  multiline
                  rows={4}
                  {...register(field.name)}
                  fullWidth
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />
              ) : (
                <TextField
                  id={field.name}
                  label={field.label}
                  variant="outlined"
                  type={field.type}
                  {...register(field.name)}
                  fullWidth
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
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

export default GenericForm;
