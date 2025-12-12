import React from 'react';
import { AddRemoveButton } from '@shared/components';

interface HourSelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HourSelector = React.memo(({ value, onIncrement, onDecrement }: HourSelectorProps) => {
  return (
    <div className="hour-selection-container full-width">
      <div className="button-group">
        <AddRemoveButton variant="remove" onClick={onDecrement} disabled={value <= 1} />
        <div>
          <span className="hour-value">{value}</span>
        </div>
        <AddRemoveButton variant="add" onClick={onIncrement} />
      </div>
    </div>
  );
});

HourSelector.displayName = 'HourSelector';
