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

// Icons for parking and sections
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';
import BlockIcon from '@mui/icons-material/Block';

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'textarea'
  | 'checkbox'
  | 'select'
  | 'businessHours'
  | 'languageToggle'
  | 'parkingSelect'
  | 'sectionHeader';

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

  const handlePlaceSelected = (
    place: google.maps.places.PlaceResult,
    englishData?: { address: string; city: string }
  ) => {
    if (place.geometry && place.geometry.location) {
      setLat(place.geometry.location.lat());
      setLng(place.geometry.location.lng());

      // Use English address for storage (from geocoding), fall back to formatted_address
      const addressToStore = englishData?.address || place.formatted_address;
      if (addressToStore) {
        const addressField = fields.find((f) => f.name === 'address');
        // Update the form field value with the English address
        handleFieldChange('address', addressToStore, addressField?.onChange);
      }

      // Use English city name for storage, fall back to address_components
      if (englishData?.city) {
        setCity(englishData.city);
      } else if (place.address_components) {
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

  // Track which multiSelect fields are expanded (show all options)
  const [expandedMultiSelects, setExpandedMultiSelects] = useState<Record<string, boolean>>({});

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

    // Call onSubmit first to allow parent to enrich data (e.g., add coverImage, galleryImages, etc.)
    // Then validate the enriched data
    if (schema && zodForm) {
      // First, let the parent enrich the data by calling onSubmit with a callback
      // But we need to validate after enrichment, so we'll do it differently
      // For now, validate what we have, and parent can handle additional validation
      zodForm.setFormData(data);
      const validationError = zodForm.validate();
      if (validationError) {
        console.warn('Form validation failed:', validationError);
        console.warn('Form data:', data);
        console.warn('Validation errors:', zodForm.errors);
        // Don't submit if validation fails, but errors should already be set in zodForm.errors
        return;
      }
    }

    console.log('Form submitting with data:', data);
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
        // Check for errors from both zodForm and field.error prop (from SteppedForm)
        const fieldError = field.error || zodForm?.errors[field.name];
        const hasError = !!fieldError;
        const errorClassName = hasError ? 'has-error' : '';
        const inputErrorClassName = hasError ? 'error' : '';

        switch (field.type) {
          case 'text':
          case 'number':
            if (field.name === 'address') {
              return (
                <div key={field.name} className={`form-group ${field.className || ''} ${errorClassName}`}>
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <GoogleAddressAutocomplete
                    defaultValue={field.value || ''}
                    placeholder={field.placeholder}
                    onPlaceSelected={handlePlaceSelected}
                    fieldName={field.name}
                    onInputChange={(value: string) => {
                      handleFieldChange('address', value, field.onChange);
                    }}
                    aria-describedby={
                      hasError ? `error-${field.name}` : field.helperText ? `helper-${field.name}` : undefined
                    }
                    aria-invalid={hasError}
                  />
                  {field.helperText && (
                    <p id={`helper-${field.name}`} className="form-helper-text">
                      {field.helperText}
                    </p>
                  )}
                  {showFieldErrors && fieldError && <FieldError error={fieldError} fieldName={field.name} />}
                </div>
              );
            }
            // Use controlled input if onChange is provided (for stepped forms), otherwise use uncontrolled (for regular forms)
            const isControlled = !!field.onChange;
            const inputValue = field.value !== undefined && field.value !== null ? String(field.value) : '';

            return (
              <div key={field.name} className={`form-group ${field.className || ''} ${errorClassName}`}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  {...(isControlled ? { value: inputValue } : { defaultValue: inputValue })}
                  className={`form-input ${inputErrorClassName}`}
                  required={!schema}
                  aria-describedby={
                    hasError ? `error-${field.name}` : field.helperText ? `helper-${field.name}` : undefined
                  }
                  aria-invalid={hasError}
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
                {field.helperText && (
                  <p id={`helper-${field.name}`} className="form-helper-text">
                    {field.helperText}
                  </p>
                )}
                {showFieldErrors && fieldError && <FieldError error={fieldError} fieldName={field.name} />}
              </div>
            );

          case 'textarea':
            // Use controlled textarea if onChange is provided (for stepped forms), otherwise use uncontrolled (for regular forms)
            const isTextareaControlled = !!field.onChange;
            const textareaValue = field.value !== undefined && field.value !== null ? String(field.value) : '';

            return (
              <div key={field.name} className={`form-group ${field.className || ''} ${errorClassName}`}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  {...(isTextareaControlled ? { value: textareaValue } : { defaultValue: textareaValue })}
                  className={`form-textarea ${inputErrorClassName}`}
                  rows={field.rows || 4}
                  required={!schema}
                  aria-describedby={
                    hasError ? `error-${field.name}` : field.helperText ? `helper-${field.name}` : undefined
                  }
                  aria-invalid={hasError}
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
                {field.helperText && (
                  <p id={`helper-${field.name}`} className="form-helper-text">
                    {field.helperText}
                  </p>
                )}
                {showFieldErrors && fieldError && <FieldError error={fieldError} fieldName={field.name} />}
              </div>
            );
          case 'businessHours':
            return (
              <div key={field.name} className={`form-group ${field.className || ''} ${errorClassName}`}>
                <BusinessHours
                  value={field.value || { days: [], times: [defaultHours] }}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  error={fieldError}
                  fieldName={field.name}
                />
              </div>
            );
          case 'languageToggle':
            const hasOtherLanguageErrors = (field as any).hasOtherLanguageErrors || false;
            const otherLanguage = field.value === 'en' ? 'he' : 'en';
            return (
              <div key={field.name} className={`form-group ${field.className || ''}`}>
                {field.label && <label className="form-label">{field.label}</label>}
                <div className="form-language-toggle">
                  <button
                    type="button"
                    onClick={() => field.onChange?.('en')}
                    className={`form-language-toggle__btn ${field.value === 'en' ? 'active' : ''} ${hasOtherLanguageErrors && field.value === 'he' ? 'has-errors' : ''}`}
                    title={hasOtherLanguageErrors && field.value === 'he' ? 'Switch to English to see errors' : ''}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange?.('he')}
                    className={`form-language-toggle__btn ${field.value === 'he' ? 'active' : ''} ${hasOtherLanguageErrors && field.value === 'en' ? 'has-errors' : ''}`}
                    title={hasOtherLanguageErrors && field.value === 'en' ? 'Switch to Hebrew to see errors' : ''}
                  >
                    עברית
                  </button>
                </div>
                {hasOtherLanguageErrors && (
                  <div className="form-language-toggle__hint">
                    Switch to {otherLanguage === 'en' ? 'English' : 'Hebrew'} to view and fix errors
                  </div>
                )}
              </div>
            );
          case 'parkingSelect':
            const parkingOptionsConfig = [
              { id: 'private', labelKey: 'private', Icon: LocalParkingIcon },
              { id: 'street', labelKey: 'street', Icon: DirectionsCarIcon },
              { id: 'paid', labelKey: 'paid', Icon: LocalParkingOutlinedIcon },
              { id: 'none', labelKey: 'none', Icon: BlockIcon }
            ];
            return (
              <div key={field.name} className={`form-group parking-select ${field.className || ''}`}>
                <div className="section-header">
                  <div className="section-header__title-row">
                    <DirectionsCarIcon className="section-header__icon" />
                    <h3 className="section-header__title">{field.label || t('form.parking.label')}</h3>
                  </div>
                  <p className="section-header__subtitle">{t('form.parking.question')}</p>
                </div>
                <div className="parking-select__grid">
                  {parkingOptionsConfig.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => field.onChange?.(option.id)}
                      className={`parking-select__item ${field.value === option.id ? 'parking-select__item--selected' : ''}`}
                    >
                      <option.Icon className="parking-select__icon" />
                      <span className="parking-select__label">{t(`form.parking.options.${option.labelKey}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          case 'sectionHeader':
            const IconComponent = field.icon;
            const stepCounter = (field as any).stepCounter;
            return (
              <div key={field.name} className={`form-group section-header-wrapper ${field.className || ''}`}>
                <div className="section-header">
                  <div className="section-header__title-row">
                    {IconComponent && <IconComponent className="section-header__icon" />}
                    <h3 className="section-header__title">{field.label}</h3>
                    {stepCounter && (
                      <span className="section-header__step-counter">
                        {t('form.stepCounter', {
                          current: stepCounter.current,
                          total: stepCounter.total,
                          defaultValue: `Step ${stepCounter.current} of ${stepCounter.total}`
                        })}
                      </span>
                    )}
                  </div>
                  {field.subtitle && <p className="section-header__subtitle">{field.subtitle}</p>}
                </div>
              </div>
            );
          case 'select':
            return (
              <div
                key={field.name}
                className={`form-group select-container ${field.className || ''} ${errorClassName}`}
                data-field-name={field.name}
              >
                <label className="form-label">{field.label}</label>
                <Listbox value={field.value} onChange={field.onChange}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button
                        className={`listbox-button ${inputErrorClassName}`}
                        aria-describedby={
                          hasError ? `error-${field.name}` : field.helperText ? `helper-${field.name}` : undefined
                        }
                        aria-invalid={hasError}
                      >
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
                {field.helperText && (
                  <p id={`helper-${field.name}`} className="form-helper-text">
                    {field.helperText}
                  </p>
                )}
                {showFieldErrors && fieldError && <FieldError error={fieldError} fieldName={field.name} />}
              </div>
            );

          case 'multiSelect':
            const initialVisibleCount = field.initialVisibleCount ?? field.options.length;
            const shouldShowExpandButton = field.options.length > initialVisibleCount;
            const isExpanded = expandedMultiSelects[field.name] || false;
            // Show all options - CSS will handle the height cutoff for partial rows
            const visibleOptions = field.options;

            return (
              <div key={field.name} className={`form-group ${errorClassName}`}>
                <label className="form-label">{field.label}</label>
                {field.helperText && (
                  <p id={`helper-${field.name}`} className="form-helper-text">
                    {field.helperText}
                  </p>
                )}
                <div
                  className={`checkbox-group ${field.bubbleStyle ? 'bubble-style' : ''} ${shouldShowExpandButton && !isExpanded ? 'collapsed-with-fade' : ''}`}
                >
                  {visibleOptions.map((option: string) => (
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
                {shouldShowExpandButton && (
                  <button
                    type="button"
                    onClick={() => setExpandedMultiSelects((prev) => ({ ...prev, [field.name]: !isExpanded }))}
                    className="show-all-button"
                  >
                    {isExpanded
                      ? field.showLessLabel || 'Show Less'
                      : field.showAllLabel || `Show All (${field.options.length - initialVisibleCount} more)`}
                  </button>
                )}
                {showFieldErrors && fieldError && <FieldError error={fieldError} fieldName={field.name} />}
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
