import React from 'react';
import { MetaBudgetInput } from '../shared/MetaBudgetInput';
import { PLACEMENT_OPTIONS } from '../../utils/campaignObjectives';

interface AdSetConfigStepProps {
  adSetName: string;
  budgetType: 'daily' | 'lifetime';
  budget: number;
  startDate: string;
  endDate: string;
  placements: 'automatic' | 'manual';
  manualPlacements: string[];
  onUpdate: (field: string, value: unknown) => void;
}

export const AdSetConfigStep: React.FC<AdSetConfigStepProps> = ({
  adSetName,
  budgetType,
  budget,
  startDate,
  endDate,
  placements,
  manualPlacements,
  onUpdate
}) => {
  const togglePlacement = (value: string) => {
    const current = manualPlacements;
    const next = current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value];
    onUpdate('manualPlacements', next);
  };

  return (
    <div className="meta-wizard-step">
      <div className="meta-form-field">
        <label>Ad Set Name</label>
        <input
          type="text"
          value={adSetName}
          onChange={(e) => onUpdate('adSetName', e.target.value)}
          className="meta-input"
          placeholder="e.g., Israel 25-45 Interest Targeting"
        />
      </div>

      <div className="meta-form-field">
        <label>Budget</label>
        <MetaBudgetInput
          value={budget}
          onChange={(v) => onUpdate('budget', v)}
          budgetType={budgetType}
          onBudgetTypeChange={(t) => onUpdate('budgetType', t)}
        />
      </div>

      <div className="meta-form-row">
        <div className="meta-form-field">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onUpdate('startDate', e.target.value)}
            className="meta-input"
          />
        </div>
        <div className="meta-form-field">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onUpdate('endDate', e.target.value)}
            className="meta-input"
            min={startDate}
          />
        </div>
      </div>

      <div className="meta-form-field">
        <label>Placements</label>
        <div className="meta-placement-toggle">
          <button
            type="button"
            className={`meta-btn ${placements === 'automatic' ? 'meta-btn--primary' : 'meta-btn--ghost'}`}
            onClick={() => onUpdate('placements', 'automatic')}
          >
            Automatic (Recommended)
          </button>
          <button
            type="button"
            className={`meta-btn ${placements === 'manual' ? 'meta-btn--primary' : 'meta-btn--ghost'}`}
            onClick={() => onUpdate('placements', 'manual')}
          >
            Manual
          </button>
        </div>
      </div>

      {placements === 'manual' && (
        <div className="meta-form-field">
          <label>Select Placements</label>
          <div className="meta-placement-grid">
            {PLACEMENT_OPTIONS.map((opt) => (
              <label key={opt.value} className="meta-checkbox-label">
                <input
                  type="checkbox"
                  checked={manualPlacements.includes(opt.value)}
                  onChange={() => togglePlacement(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
