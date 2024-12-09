import { Fragment, useState } from 'react';
import { Listbox, Switch, Field, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type FieldType = 'text' | 'password' | 'email' | 'textarea' | 'checkbox' | 'select';

interface GenericFormProps {
  title?: string;
  fields: any[];
  btnTxt?: string;
  onSubmit: (formData: Record<string, any>) => void;
  className?: string;
  onCategoryChange?: (values: string[]) => void;
}

export const GenericForm = ({ fields, onSubmit, className }: GenericFormProps) => {
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(() =>
    fields.reduce(
      (acc, field) => {
        if (field.type === 'checkbox') {
          acc[field.name] = false;
        }
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Convert boolean values to strings
    Object.entries(checkboxStates).forEach(([name, value]) => {
      data[name] = value.toString();
    });

    onSubmit(data);
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

          case 'multiSelect':
            return (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                <div className="checkbox-group">
                  {field.options.map((option: string) => (
                    <Field key={option} as="div" className="multiselect-option">
                      <Switch
                        checked={field.value?.includes(option)}
                        onChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), option]
                            : field.value?.filter((val: string) => val !== option);
                          field.onChange?.(newValue);
                        }}
                        className={`multiselect-checkbox ${field.value?.includes(option) ? 'selected' : ''}`}
                      >
                        <Label className="multiselect-label">{option}</Label>
                      </Switch>
                    </Field>
                  ))}
                </div>
              </div>
            );

          case 'checkbox':
            return (
              <div key={field.name} className="form-group-checkbox">
                <Field as="div" className="switch-group">
                  <Switch
                    name={field.name}
                    checked={checkboxStates[field.name]}
                    onChange={(checked) => {
                      setCheckboxStates((prev) => ({
                        ...prev,
                        [field.name]: checked
                      }));
                    }}
                    className={`switch ${checkboxStates[field.name] ? 'on' : ''}`}
                  ></Switch>
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
