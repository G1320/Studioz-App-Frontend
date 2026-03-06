import React from 'react';
import { useTranslation } from 'react-i18next';
import { CAMPAIGN_OBJECTIVES } from '../../utils/campaignObjectives';
import type { CampaignObjective } from '../../types/meta.types';

interface CampaignObjectiveStepProps {
  selectedObjective: CampaignObjective;
  campaignName: string;
  onObjectiveChange: (objective: CampaignObjective) => void;
  onNameChange: (name: string) => void;
}

export const CampaignObjectiveStep: React.FC<CampaignObjectiveStepProps> = ({
  selectedObjective,
  campaignName,
  onObjectiveChange,
  onNameChange
}) => {
  const { i18n } = useTranslation();
  const isHe = i18n.language === 'he';

  return (
    <div className="meta-wizard-step">
      <div className="meta-form-field">
        <label>Campaign Name</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => onNameChange(e.target.value)}
          className="meta-input"
          placeholder="e.g., Summer 2025 Traffic Campaign"
          required
        />
      </div>

      <div className="meta-form-field">
        <label>Campaign Objective</label>
        <div className="meta-objective-grid">
          {CAMPAIGN_OBJECTIVES.map((obj) => (
            <button
              key={obj.key}
              type="button"
              className={`meta-objective-card ${selectedObjective === obj.key ? 'meta-objective-card--selected' : ''}`}
              onClick={() => onObjectiveChange(obj.key)}
            >
              <h4 className="meta-objective-card__title">{isHe ? obj.labelHe : obj.label}</h4>
              <p className="meta-objective-card__desc">{isHe ? obj.descriptionHe : obj.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
