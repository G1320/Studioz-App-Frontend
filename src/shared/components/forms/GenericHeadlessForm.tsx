import { Fragment, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Listbox, Switch, Field, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { ZodSchema } from 'zod';
import { ValidationMode } from '@shared/validation/types';
import { useZodForm } from '@shared/validation/hooks/useZodForm';
import { FieldError } from '@shared/validation/components';

import { GoogleAddressAutocomplete } from '@shared/components';
import { BusinessHours, defaultHours } from './form-utils';

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'textarea'
  | 'checkbox'
  | 'select'
  | 'businessHours'
  | 'languageToggle';

interface GenericFormProps {
  title?: string;
  fields: any[];
  btnTxt?: string;
  onSubmit: (formData: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  onCategoryChange?: (values: string[]) => void;
  children?: ReactNode;
  formId?: string;
  hideSubmit?: boolean;
  /** Zod schema for validation */
  schema?: ZodSchema;
  /** Validation mode */
  validationMode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean) => void;
  /** Whether to show field errors */
  showFieldErrors?: boolean;
}

export const GenericForm = ({
  fields,
  onSubmit,
  className,
  btnTxt,
  children,
  formId,
  hideSubmit = false,
  schema,
  validationMode = 'onSubmit',
  onValidationChange,
  showFieldErrors = true
}: GenericFormProps) => {
  const { t } = useTranslation('forms');
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [city, setCity] = useState<string>('');

  // Initialize form data from field values
  const initialFormData = fields.reduce(
    (acc, field) => {
      if (field.name.includes('.')) {
        const [parent, child] = field.name.split('.');
        acc[parent] = acc[parent] || {};
        acc[parent][child] = field.value;
      } else {
        acc[field.name] = field.value;
      }
      return acc;
    },
    {} as Record<string, any>
  );

  // Use Zod validation if schema is provided
  const zodForm = schema
    ? useZodForm(schema, {
        initialData: initialFormData,
        mode: validationMode as ValidationMode
      })
    : null;

  // Notify parent of validation state changes
  useEffect(() => {
    if (onValidationChange && zodForm) {
      onValidationChange(zodForm.isValid);
    }
  }, [zodForm?.isValid, onValidationChange]);

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      setLat(place.geometry.location.lat());
      setLng(place.geometry.location.lng());

      if (place.formatted_address) {
        const addressField = fields.find((f) => f.name === 'address');
        // Update the form field value - this will trigger SteppedForm's handleFieldChange
        handleFieldChange('address', place.formatted_address, addressField?.onChange);
      }
      if (place.address_components) {
        const cityComponent = place.address_components.find((component) => component.types.includes('locality'));
        if (cityComponent) {
          setCity(cityComponent.long_name);
        }
      }
    }
  };

  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(() =>
    fields.reduce(
      (acc, field) => {
        if (field.type === 'checkbox') {
          // Convert string "false"/"true" to boolean, handle undefined/null, default to false
          if (field.value === undefined || field.value === null) {
            acc[field.name] = false;
          } else if (typeof field.value === 'string') {
            acc[field.name] = field.value === 'true' || field.value === '1' || field.value === 'on';
          } else {
            acc[field.name] = Boolean(field.value);
          }
        }
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Prevent nested forms (e.g., add-ons inside item forms) from bubbling up and triggering parent submits
    event.stopPropagation();
    const formData = new FormData(event.currentTarget);
    const data: Record<string, any> = {};

    // Process nested fields
    for (const [key, value] of formData.entries()) {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        data[parent] = data[parent] || {};
        data[parent][child] = value;
      } else {
        data[key] = value;
      }
    }

    // Add location data (address is already in formData from the input)
    data.lat = lat.toString();
    data.lng = lng.toString();
    data.city = city;

    // Add checkbox states
    Object.entries(checkboxStates).forEach(([name, value]) => {
      data[name] = value.toString();
    });

    // Validate with Zod if schema is provided
    if (schema && zodForm) {
      // Update form data first
      zodForm.setFormData(data);
      const validationError = zodForm.validate();
      if (validationError) {
        return; // Don't submit if validation fails
      }
    }

    onSubmit(data, event);
  };

  // Handle field blur for validation
  const handleFieldBlur = useCallback(
    (fieldName: string, value: any) => {
      if (zodForm && (validationMode === 'onBlur' || validationMode === 'all')) {
        zodForm.setField(fieldName, value);
      }
    },
    [validationMode, zodForm]
  );

  // Handle field change for validation and form data
  const handleFieldChange = useCallback(
    (fieldName: string, value: any, originalOnChange?: (value: any) => void) => {
      // Call original onChange if provided
      originalOnChange?.(value);

      // Update validation if schema is provided
      if (zodForm && (validationMode === 'onChange' || validationMode === 'all')) {
        zodForm.setField(fieldName, value);
      }
    },
    [validationMode, zodForm]
  );

  return (
    <form className={`generic-form ${className}`} onSubmit={handleSubmit} id={formId} noValidate>
      {fields.map((field) => {
        switch (field.type) {
          case 'text':
          case 'number':
            if (field.name === 'address') {
              return (
                <div key={field.name} className={`form-group ${zodForm?.errors[field.name] ? 'has-error' : ''}`}>
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <GoogleAddressAutocomplete
                    defaultValue={field.value || ''}
                    onPlaceSelected={handlePlaceSelected}
                    fieldName={field.name}
                    onInputChange={(value: string) => {
                      handleFieldChange('address', value, field.onChange);
                    }}
                  />
                  {showFieldErrors && zodForm && (
                    <FieldError error={zodForm.errors[field.name]} fieldName={field.name} />
                  )}
                </div>
              );
            }
            return (
              <div
                key={field.name}
                className={`form-group ${field.className || ''} ${zodForm?.errors[field.name] ? 'has-error' : ''}`}
              >
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                  className={`form-input ${zodForm?.errors[field.name] ? 'error' : ''}`}
                  required={!schema}
                  onBlur={(e) => {
                    const value = e.target.value;
                    handleFieldBlur(field.name, value);
                    field.onBlur?.(e);
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFieldChange(field.name, value, field.onChange);
                  }}
                />
                {showFieldErrors && zodForm && <FieldError error={zodForm.errors[field.name]} fieldName={field.name} />}
              </div>
            );

          case 'textarea':
            return (
              <div
                key={field.name}
                className={`form-group ${field.className || ''} ${zodForm?.errors[field.name] ? 'has-error' : ''}`}
              >
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                  className={`form-textarea ${zodForm?.errors[field.name] ? 'error' : ''}`}
                  rows={4}
                  required={!schema}
                  onBlur={(e) => {
                    const value = e.target.value;
                    handleFieldBlur(field.name, value);
                    field.onBlur?.(e);
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFieldChange(field.name, value, field.onChange);
                  }}
                ></textarea>
                {showFieldErrors && zodForm && <FieldError error={zodForm.errors[field.name]} fieldName={field.name} />}
              </div>
            );
          case 'businessHours':
            return (
              <BusinessHours
                key={field.name}
                value={field.value || { days: [], times: [defaultHours] }}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
              />
            );
          case 'languageToggle':
            return (
              <div key={field.name} className={`form-group ${field.className || ''}`}>
                {field.label && <label className="form-label">{field.label}</label>}
                <div className="form-language-toggle">
                  <button
                    type="button"
                    onClick={() => field.onChange?.('en')}
                    className={`form-language-toggle__btn ${field.value === 'en' ? 'active' : ''}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange?.('he')}
                    className={`form-language-toggle__btn ${field.value === 'he' ? 'active' : ''}`}
                  >
                    עברית
                  </button>
                </div>
              </div>
            );
          case 'select':
            return (
              <div
                key={field.name}
                className={`form-group select-container ${field.className || ''}`}
                data-field-name={field.name}
              >
                <label className="form-label">{field.label}</label>
                <Listbox value={field.value} onChange={field.onChange}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button className="listbox-button">
                        {field.displayValue || field.value || 'Select'}
                        <ChevronUpDownIcon className="listbox-icon" />
                      </Listbox.Button>
                      {open && (
                        <Listbox.Options className="listbox-options">
                          {field.options.map((option: string) => {
                            const optionLabel = field.getOptionLabel ? field.getOptionLabel(option) : option;
                            return (
                              <Listbox.Option key={option} value={option} as={Fragment}>
                                {({ active, selected }) => (
                                  <li
                                    className={`listbox-option ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}
                                  >
                                    {selected && <CheckIcon className="listbox-check" />}
                                    {optionLabel}
                                  </li>
                                )}
                              </Listbox.Option>
                            );
                          })}
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
                <div className={`checkbox-group ${field.bubbleStyle ? 'bubble-style' : ''}`}>
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
            // Ensure checked is always a boolean, not a string
            const checkboxValue = checkboxStates[field.name];
            const isChecked =
              typeof checkboxValue === 'string'
                ? checkboxValue === 'true' || checkboxValue === '1' || checkboxValue === 'on'
                : Boolean(checkboxValue);

            return (
              <div key={field.name} className="form-group-checkbox">
                <Field as="div" className="switch-group">
                  <Switch
                    name={field.name}
                    checked={isChecked}
                    onChange={(checked) => {
                      setCheckboxStates((prev) => ({
                        ...prev,
                        [field.name]: checked
                      }));
                    }}
                    className={`switch ${isChecked ? 'on' : ''}`}
                  ></Switch>
                  <Label className="switch-label">{field.label}</Label>
                </Field>
              </div>
            );
          default:
            return null;
        }
      })}
      {children}
      {!hideSubmit && (
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {btnTxt || t('form.submit.button')}
          </button>
        </div>
      )}
    </form>
  );
};
