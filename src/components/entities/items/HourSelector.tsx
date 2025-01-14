// components/items/HourSelector.tsx
import React from 'react';

interface HourSelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HourSelector = React.memo(({ value, onIncrement, onDecrement }: HourSelectorProps) => {
  return (
    <div className="hour-selection-container">
      <div>
        <span className="hour-label"> Hours:</span>
        <span className="hour-value">{value}</span>
      </div>
      <div className="button-group">
        <button className="control-button minus" onClick={onDecrement}>
          −
        </button>
        <button className="control-button plus" onClick={onIncrement}>
          +
        </button>
      </div>
    </div>
  );
});

HourSelector.displayName = 'HourSelector';
