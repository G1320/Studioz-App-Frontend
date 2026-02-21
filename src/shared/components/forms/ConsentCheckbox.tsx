import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import './styles/_consent-checkbox.scss';

interface ConsentCheckboxProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: 'dataProcessing' | 'marketing';
  required?: boolean;
  error?: string;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  name,
  checked,
  onChange,
  variant = 'dataProcessing',
  required = variant === 'dataProcessing',
  error
}) => {
  const { i18n } = useTranslation('forms');
  const privacyPath = `/${i18n.language}/privacy`;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className={`consent-checkbox ${error ? 'consent-checkbox--error' : ''}`}>
      <label className="consent-checkbox__label">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="consent-checkbox__input"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        <span className="consent-checkbox__text">
          <Trans
            i18nKey={`forms:consent.${variant}`}
            components={{
              privacyLink: <Link to={privacyPath} className="consent-checkbox__link" />
            }}
          />
        </span>
      </label>
      {error && (
        <p id={errorId} className="consent-checkbox__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
