import { Fragment } from 'react';
import { Listbox, Switch, Field, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select';

// interface Field {
//   name: string;
//   label: string;
//   type?: FieldType;
//   value?: string | number | boolean;
//   options?: string[];
// }

interface GenericFormProps {
  fields: any[];
  onSubmit: (formData: Record<string, any>) => void;
  className?: string;
  onCategoryChange?: (value: string) => void;
}

export const GenericForm = ({ fields, onSubmit, className, onCategoryChange }: GenericFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'category' && onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <form className={`generic-form ${className}`} onSubmit={handleSubmit}>
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
          case 'number':
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  defaultValue={field.value}
                  className="form-input"
                  required
                />
              </div>
            );

          case 'textarea':
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  defaultValue={field.value}
                  className="form-textarea"
                  rows={4}
                  required
                ></textarea>
              </div>
            );

          case 'select':
            return (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                <Listbox value={field.value} onChange={field.onChange}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button className="listbox-button">
                        {field.value || 'Select'}
                        <ChevronUpDownIcon className="listbox-icon" />
                      </Listbox.Button>
                      {open && (
                        <Listbox.Options className="listbox-options">
                          {field.options.map((option: string) => (
                            <Listbox.Option key={option} value={option} as={Fragment}>
                              {({ active, selected }) => (
                                <li
                                  className={`listbox-option ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}
                                >
                                  {selected && <CheckIcon className="listbox-check" />}
                                  {option}
                                </li>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      )}
                    </div>
                  )}
                </Listbox>
              </div>
            );

          case 'checkbox':
            return (
              <div key={field.name} className="form-group-checkbox">
                <Field as="div" className="switch-group">
                  <Switch
                    as="button"
                    name={field.name}
                    className={`switch ${field.value ? 'on' : ''}`}
                    checked={field.value || false}
                    onChange={(value) => (field.onChange ? field.onChange(value) : undefined)}
                  />
                  <Label className="switch-label">{field.label}</Label>
                </Field>
              </div>
            );

          default:
            return null;
        }
      })}
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
};
