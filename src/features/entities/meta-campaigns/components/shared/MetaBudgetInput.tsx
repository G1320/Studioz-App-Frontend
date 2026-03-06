import React from 'react';

interface MetaBudgetInputProps {
  value: number;
  onChange: (value: number) => void;
  budgetType: 'daily' | 'lifetime';
  onBudgetTypeChange: (type: 'daily' | 'lifetime') => void;
  currency?: string;
}

export const MetaBudgetInput: React.FC<MetaBudgetInputProps> = ({
  value,
  onChange,
  budgetType,
  onBudgetTypeChange,
  currency = 'USD'
}) => {
  return (
    <div className="meta-budget-input">
      <div className="meta-budget-input__type-toggle">
        <button
          type="button"
          className={`meta-budget-input__type-btn ${budgetType === 'daily' ? 'meta-budget-input__type-btn--active' : ''}`}
          onClick={() => onBudgetTypeChange('daily')}
        >
          Daily
        </button>
        <button
          type="button"
          className={`meta-budget-input__type-btn ${budgetType === 'lifetime' ? 'meta-budget-input__type-btn--active' : ''}`}
          onClick={() => onBudgetTypeChange('lifetime')}
        >
          Lifetime
        </button>
      </div>
      <div className="meta-budget-input__field">
        <span className="meta-budget-input__currency">{currency === 'USD' ? '$' : currency}</span>
        <input
          type="number"
          min={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="meta-budget-input__input"
          placeholder="0.00"
        />
      </div>
      {budgetType === 'daily' && value > 0 && (
        <p className="meta-budget-input__hint">
          Estimated monthly spend: ${(value * 30.4).toFixed(2)}
        </p>
      )}
    </div>
  );
};
