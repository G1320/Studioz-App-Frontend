// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select' | 'number';

// interface Field {
//   name: string;
//   label: string;
//   type?: FieldType;
//   value?: string | number | boolean;
//   options?: string[];
// }

// interface GenericFormProps {
//   title?: string;
//   fields: Field[];
//   onSubmit: (data: Record<string, any>) => void;
//   className?: string;
//   btnTxt?: string;
//   onCategoryChange?: (value: string) => void;
// }

// export const GenericForm: React.FC<GenericFormProps> = ({
//   title,
//   fields,
//   onSubmit,
//   className,
//   btnTxt = 'Submit',
//   onCategoryChange
// }) => {
//   // Dynamically create a Zod schema based on fields
//   const formSchema = z.object(
//     fields.reduce((acc, field) => {
//       let schema;
//       switch (field.type) {
//         case 'checkbox':
//           schema = z.boolean().optional();
//           break;
//         case 'number':
//           schema = z.number().min(1).optional();
//           break;
//         case 'select':
//           schema = z.string().optional();
//           break;
//         default:
//           schema = z.string().optional();
//       }
//       return { ...acc, [field.name]: schema };
//     }, {})
//   );

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: fields.reduce(
//       (acc, field) => ({
//         ...acc,
//         [field.name]: field.value || (field.type === 'checkbox' ? false : '')
//       }),
//       {}
//     )
//   });

//   const handleSubmitForm = (data: z.infer<typeof formSchema>) => {
//     onSubmit(data);
//     form.reset();
//   };

//   return (
//     <section className={`space-y-6 ${className}`}>
//       {title && <h2 className="text-2xl font-bold">{title}</h2>}

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
//           {fields.map((field) => (
//             <FormField
//               key={field.name}
//               control={form.control}
//               name={field.name}
//               render={({ field: formField }) => (
//                 <FormItem>
//                   <FormLabel>{field.label}</FormLabel>
//                   <FormControl>
//                     {field.type === 'checkbox' ? (
//                       <Checkbox checked={formField.value as boolean} onCheckedChange={formField.onChange} />
//                     ) : field.type === 'select' ? (
//                       <Select
//                         onValueChange={(value) => {
//                           formField.onChange(value);
//                           if (field.name === 'category' && onCategoryChange) {
//                             onCategoryChange(value);
//                           }
//                         }}
//                         defaultValue={formField.value as string}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder={field.label} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {field.options?.map((option) => (
//                             <SelectItem key={option} value={option}>
//                               {option}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ) : field.type === 'textarea' ? (
//                       <Textarea {...formField} placeholder={field.label} />
//                     ) : (
//                       <Input {...formField} type={field.type} placeholder={field.label} />
//                     )}
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}

//           <Button type="submit" className="w-full">
//             {btnTxt}
//           </Button>
//         </form>
//       </Form>
//     </section>
//   );
// };
