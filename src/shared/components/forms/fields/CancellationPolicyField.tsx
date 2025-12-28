import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/_cancellationPolicyField.scss';

export interface CancellationPolicy {
  type?: 'flexible' | 'moderate' | 'strict';
  notes?: {
    en?: string;
    he?: string;
  };
}

interface CancellationPolicyFieldProps {
  value?: CancellationPolicy;
  onChange: (value: CancellationPolicy) => void;
  className?: string;
  error?: string;
}

export const CancellationPolicyField = ({
  value = {},
  onChange,
  className = '',
  error
}: CancellationPolicyFieldProps) => {
  const { t } = useTranslation('forms');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'he'>('en');

  const policyTypes: Array<{ type: CancellationPolicy['type']; key: string }> = [
    { type: 'flexible', key: 'flexible' },
    { type: 'moderate', key: 'moderate' },
    { type: 'strict', key: 'strict' }
  ];

  const handleTypeChange = (type: CancellationPolicy['type']) => {
    onChange({ ...value, type });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = {
      ...value.notes,
      [selectedLanguage]: e.target.value
    };
    onChange({ ...value, notes });
  };

  return (
    <div className={`cancellation-policy-field ${className} ${error ? 'has-error' : ''}`}>
      <div className="cancellation-policy-field__header">
        <label className="cancellation-policy-field__label">
          {t('form.cancellationPolicy.label')}
        </label>
        <p className="cancellation-policy-field__description">
          {t('form.cancellationPolicy.description')}
        </p>
      </div>

      <div className="cancellation-policy-field__types">
        {policyTypes.map(({ type, key }) => (
          <button
            key={type}
            type="button"
            className={`cancellation-policy-field__type ${value.type === type ? 'selected' : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            <span className="cancellation-policy-field__type-name">
              {t(`form.cancellationPolicy.type.${key}`)}
            </span>
            <span className="cancellation-policy-field__type-desc">
              {t(`form.cancellationPolicy.type.${key}Desc`)}
            </span>
          </button>
        ))}
      </div>

      <div className="cancellation-policy-field__notes">
        <div className="cancellation-policy-field__notes-header">
          <label className="cancellation-policy-field__notes-label">
            {t('form.cancellationPolicy.notes.label')}
          </label>
          <div className="cancellation-policy-field__language-toggle">
            <button
              type="button"
              className={`cancellation-policy-field__lang-btn ${selectedLanguage === 'en' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('en')}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              className={`cancellation-policy-field__lang-btn ${selectedLanguage === 'he' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('he')}
            >
              🇮🇱 HE
            </button>
          </div>
        </div>
        <textarea
          value={value.notes?.[selectedLanguage] ?? ''}
          onChange={handleNotesChange}
          placeholder={t('form.cancellationPolicy.notes.placeholder')}
          className="cancellation-policy-field__textarea"
          rows={3}
          maxLength={500}
          dir={selectedLanguage === 'he' ? 'rtl' : 'ltr'}
        />
      </div>

      {error && <span className="cancellation-policy-field__error">{error}</span>}
    </div>
  );
};

export default CancellationPolicyField;
