import React from 'react';
import { CAMPAIGN_OBJECTIVES, CTA_TYPES } from '../../utils/campaignObjectives';
import type { CampaignWizardState } from '../../types/meta.types';

interface ReviewStepProps {
  state: CampaignWizardState;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ state }) => {
  const objectiveLabel = CAMPAIGN_OBJECTIVES.find(o => o.key === state.objective)?.label || state.objective;
  const ctaLabel = CTA_TYPES.find(c => c.value === state.ctaType)?.label || state.ctaType;

  return (
    <div className="meta-wizard-step meta-review">
      <h3 className="meta-review__title">Review Campaign Settings</h3>

      <div className="meta-review__section">
        <h4>Campaign</h4>
        <div className="meta-review__row">
          <span>Name:</span><strong>{state.campaignName}</strong>
        </div>
        <div className="meta-review__row">
          <span>Objective:</span><strong>{objectiveLabel}</strong>
        </div>
      </div>

      <div className="meta-review__section">
        <h4>Ad Set</h4>
        <div className="meta-review__row">
          <span>Name:</span><strong>{state.adSetName}</strong>
        </div>
        <div className="meta-review__row">
          <span>Budget:</span>
          <strong>${state.budget} {state.budgetType}</strong>
        </div>
        <div className="meta-review__row">
          <span>Schedule:</span>
          <strong>{state.startDate} - {state.endDate || 'Ongoing'}</strong>
        </div>
        <div className="meta-review__row">
          <span>Placements:</span>
          <strong>{state.placements === 'automatic' ? 'Automatic' : state.manualPlacements.join(', ')}</strong>
        </div>
      </div>

      <div className="meta-review__section">
        <h4>Audience</h4>
        <div className="meta-review__row">
          <span>Locations:</span>
          <strong>{state.targeting.geo_locations?.countries?.join(', ') || 'Not set'}</strong>
        </div>
        <div className="meta-review__row">
          <span>Age:</span>
          <strong>{state.targeting.age_min || 18} - {state.targeting.age_max || 65}</strong>
        </div>
        <div className="meta-review__row">
          <span>Gender:</span>
          <strong>
            {!state.targeting.genders?.length ? 'All' : state.targeting.genders.includes(1) ? 'Male' : 'Female'}
          </strong>
        </div>
      </div>

      <div className="meta-review__section">
        <h4>Creative</h4>
        <div className="meta-review__row">
          <span>Media:</span><strong>{state.mediaType}</strong>
        </div>
        <div className="meta-review__row">
          <span>Headline:</span><strong>{state.headline}</strong>
        </div>
        <div className="meta-review__row">
          <span>Text:</span><strong>{state.primaryText}</strong>
        </div>
        <div className="meta-review__row">
          <span>CTA:</span><strong>{ctaLabel}</strong>
        </div>
        <div className="meta-review__row">
          <span>URL:</span><strong>{state.destinationUrl}</strong>
        </div>
      </div>
    </div>
  );
};
