import React from 'react';
import { AddRemoveButton } from '@shared/components';
import { motion, AnimatePresence } from 'framer-motion';

interface HourSelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HourSelector = React.memo(({ value, onIncrement, onDecrement }: HourSelectorProps) => {
  const prevValue = React.useRef(value);
  const direction = value > prevValue.current ? 1 : -1;

  React.useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <div className="hour-selection-container full-width">
      <div className="button-group">
        <AddRemoveButton variant="remove" onClick={onDecrement} disabled={value <= 1} />
        <div className="hour-value-container">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              key={value}
              className="hour-value"
              custom={direction}
              variants={{
                enter: (direction: number) => ({
                  y: direction > 0 ? '100%' : '-100%',
                  opacity: 0,
                  position: 'absolute'
                }),
                center: {
                  y: 0,
                  opacity: 1,
                  position: 'relative'
                },
                exit: (direction: number) => ({
                  y: direction > 0 ? '-100%' : '100%',
                  opacity: 0,
                  position: 'absolute'
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={{ display: 'block', width: '100%', textAlign: 'center' }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        <AddRemoveButton variant="add" onClick={onIncrement} />
      </div>
    </div>
  );
});

HourSelector.displayName = 'HourSelector';
