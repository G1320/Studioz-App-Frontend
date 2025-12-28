import { useTranslation } from 'react-i18next';
import './styles/_durationField.scss';

export interface Duration {
  value?: number;
  unit?: 'minutes' | 'hours' | 'days';
}

interface DurationFieldProps {
  name: string;
  label: string;
  description?: string;
  value?: Duration;
  onChange: (value: Duration) => void;
  unitOptions?: ('minutes' | 'hours' | 'days')[];
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
  unitOptions = ['minutes', 'hours', 'days'],
  className = '',
  error,
  disabled = false
}: DurationFieldProps) => {
  const { t } = useTranslation('forms');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? undefined : Number(e.target.value);
    onChange({ ...value, value: numValue });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = e.target.value as Duration['unit'];
    onChange({ ...value, unit: unit || undefined });
  };

  const unitLabels: Record<string, string> = {
    minutes: t('form.bookingSettings.units.minutes'),
    hours: t('form.bookingSettings.units.hours'),
    days: t('form.bookingSettings.units.days')
  };

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
          value={value.unit ?? ''}
          onChange={handleUnitChange}
          className="duration-field__unit"
          aria-label={t('form.bookingSettings.minimumBookingDuration.unit')}
          disabled={disabled}
        >
          <option value="">{t('form.bookingSettings.minimumBookingDuration.unit')}</option>
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
