import React from 'react';
import type { MetaTargeting } from '../../types/meta.types';

interface AudienceTargetingStepProps {
  targeting: MetaTargeting;
  onUpdate: (targeting: MetaTargeting) => void;
}

export const AudienceTargetingStep: React.FC<AudienceTargetingStepProps> = ({ targeting, onUpdate }) => {
  const updateField = (path: string, value: unknown) => {
    const updated = { ...targeting };
    if (path === 'age_min') updated.age_min = value as number;
    else if (path === 'age_max') updated.age_max = value as number;
    else if (path === 'genders') updated.genders = value as number[];
    else if (path === 'countries') {
      updated.geo_locations = {
        ...updated.geo_locations,
        countries: (value as string).split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      };
    }
    onUpdate(updated);
  };

  return (
    <div className="meta-wizard-step">
      <div className="meta-form-field">
        <label>Locations (country codes, comma-separated)</label>
        <input
          type="text"
          value={targeting.geo_locations?.countries?.join(', ') || ''}
          onChange={(e) => updateField('countries', e.target.value)}
          className="meta-input"
          placeholder="e.g., IL, US, GB"
        />
      </div>

      <div className="meta-form-row">
        <div className="meta-form-field">
          <label>Min Age</label>
          <input
            type="number"
            min={18}
            max={65}
            value={targeting.age_min || 18}
            onChange={(e) => updateField('age_min', Number(e.target.value))}
            className="meta-input"
          />
        </div>
        <div className="meta-form-field">
          <label>Max Age</label>
          <input
            type="number"
            min={18}
            max={65}
            value={targeting.age_max || 65}
            onChange={(e) => updateField('age_max', Number(e.target.value))}
            className="meta-input"
          />
        </div>
      </div>

      <div className="meta-form-field">
        <label>Gender</label>
        <div className="meta-gender-toggle">
          {[
            { value: [] as number[], label: 'All' },
            { value: [1], label: 'Male' },
            { value: [2], label: 'Female' }
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`meta-btn ${
                JSON.stringify(targeting.genders || []) === JSON.stringify(opt.value)
                  ? 'meta-btn--primary'
                  : 'meta-btn--ghost'
              }`}
              onClick={() => updateField('genders', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="meta-form-field">
        <label>Interests (add via Meta targeting API)</label>
        <p className="meta-form-hint">
          Interest targeting can be configured by searching Meta's targeting categories.
          This will be populated from the Meta API targeting search.
        </p>
      </div>
    </div>
  );
};
