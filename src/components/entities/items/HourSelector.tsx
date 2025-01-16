import React from 'react';

interface HourSelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HourSelector = React.memo(({ value, onIncrement, onDecrement }: HourSelectorProps) => {
  return (
    <div className="hour-selection-container full-width">
      <div className="button-group">
        <button className="control-button minus" onClick={onDecrement}>
          −
        </button>
        <div>
          <span className="hour-value">{value}</span>
        </div>
        <button className="control-button plus" onClick={onIncrement}>
          +
        </button>
      </div>
    </div>
  );
});

HourSelector.displayName = 'HourSelector';
