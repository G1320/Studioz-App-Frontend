// import { Button } from '@components/index';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { TextField, Checkbox, FormControlLabel, Select, MenuItem, Stack } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';

// export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select' | 'multiselect';

// interface Field {
//   name: string;
//   label: string;
//   type?: FieldType;
//   value?: string | number | boolean | string[];
//   options?: string[];
//   onChange?: (value: string[]) => void;
// }

// interface GenericFormProps {
//   title?: string;
//   fields: Field[];
//   onSubmit: (data: Record<string, any>) => void;
//   className: string;
//   btnTxt?: string;
//   onCategoryChange?: (value: string[]) => void;
// }

// export const GenericMuiForm: React.FC<GenericFormProps> = ({
//   title,
//   fields,
//   onSubmit,
//   className,
//   btnTxt = 'Submit',
//   onCategoryChange
// }) => {
//   const { register, handleSubmit, reset } = useForm<Record<string, any>>();

//   const onSubmitHandler: SubmitHandler<Record<string, unknown>> = (data) => {
//     onSubmit(data);
//     reset();
//   };

//   const handleSelectChange = (event: SelectChangeEvent<string[]>, fieldName: string) => {
//     const value = event.target.value as string[];

//     if (fieldName === 'categories' && onCategoryChange) {
//       onCategoryChange(value);
//     }

//     const field = fields.find((f) => f.name === fieldName);
//     if (field?.onChange) {
//       field.onChange(value);
//     }
//   };

//   return (
//     <section className={`form generic-form ${className}`}>
//       <h2>{title}</h2>
//       <form onSubmit={handleSubmit(onSubmitHandler)}>
//         <Stack spacing={2}>
//           {fields.map((field) => (
//             <div key={field.label} className="checkbox-wrapper">
//               {field.type === 'checkbox' ? (
//                 <FormControlLabel
//                   control={
//                     <Checkbox id={field.name} {...register(field.name)} defaultChecked={field.value as boolean} />
//                   }
//                   label={field.label}
//                 />
//               ) : field.type === 'select' || field.type === 'multiselect' ? (
//                 <div className="select-wrapper">
//                   <label htmlFor={field.name}>{field.label}</label>
//                   <Select
//                     id={field.name}
//                     multiple={field.type === 'multiselect'}
//                     defaultValue={field.value as string[]}
//                     {...register(field.name)}
//                     fullWidth
//                     variant="outlined"
//                     onChange={(e) => handleSelectChange(e as SelectChangeEvent<string[]>, field.name)}
//                     sx={{
//                       color: '#fff',
//                       '& .MuiSelect-select': {
//                         color: '#fff'
//                       },
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#fff'
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#fff'
//                       },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: '#fff'
//                       }
//                     }}
//                   >
//                     {field?.options?.map((option, index) => (
//                       <MenuItem key={index} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </div>
//               ) : field.type === 'textarea' ? (
//                 <TextField
//                   id={field.name}
//                   label={field.label}
//                   defaultValue={field.value}
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   {...register(field.name)}
//                   fullWidth
//                   InputLabelProps={{ style: { color: '#fff' } }}
//                   InputProps={{ style: { color: '#fff' } }}
//                 />
//               ) : (
//                 <TextField
//                   id={field.name}
//                   label={field.label}
//                   defaultValue={field.value}
//                   variant="outlined"
//                   type={field.type}
//                   {...register(field.name)}
//                   fullWidth
//                   InputLabelProps={{ style: { color: '#fff' } }}
//                   InputProps={{ style: { color: '#fff' } }}
//                 />
//               )}
//             </div>
//           ))}
//         </Stack>
//         <Button type="submit">{btnTxt}</Button>
//       </form>
//     </section>
//   );
// };
