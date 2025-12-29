import { useTranslation } from 'react-i18next';
import './styles/_durationField.scss';

export interface Duration {
  value?: number;
  unit?: 'hours' | 'days';
}

interface DurationFieldProps {
  name: string;
  label: string;
  description?: string;
  value?: Duration;
  onChange: (value: Duration) => void;
  unitOptions?: ('hours' | 'days')[];
  className?: string;
  error?: string;
  disabled?: boolean;
}

export const DurationField = ({
  name,
  label,
  description,
  value = {},
  onChange,
  unitOptions = ['hours', 'days'],
  className = '',
  error,
  disabled = false
}: DurationFieldProps) => {
  const { t } = useTranslation('forms');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? undefined : Number(e.target.value);
    // Default unit to 'hours' when setting a value if no unit is set
    const unit = value.unit ?? 'hours';
    onChange({ ...value, value: numValue, unit });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = e.target.value as Duration['unit'];
    onChange({ ...value, unit: unit || undefined });
  };

  const unitLabels: Record<string, string> = {
    hours: t('form.bookingSettings.units.hours'),
    days: t('form.bookingSettings.units.days')
  };

  // Default to 'hours' if no unit selected
  const effectiveUnit = value.unit ?? 'hours';

  return (
    <div className={`duration-field ${className} ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className="duration-field__header">
        <label className="duration-field__label">{label}</label>
        {description && <p className="duration-field__description">{description}</p>}
      </div>
      <div className="duration-field__inputs">
        <input
          type="number"
          name={`${name}.value`}
          value={value.value ?? ''}
          onChange={handleValueChange}
          min={1}
          placeholder="0"
          className="duration-field__value"
          aria-label={t('form.bookingSettings.minimumBookingDuration.value')}
          disabled={disabled}
        />
        <select
          name={`${name}.unit`}
          value={effectiveUnit}
          onChange={handleUnitChange}
          className="duration-field__unit"
          aria-label={t('form.bookingSettings.minimumBookingDuration.unit')}
          disabled={disabled}
        >
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unitLabels[unit]}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="duration-field__error">{error}</span>}
    </div>
  );
};

export default DurationField;
