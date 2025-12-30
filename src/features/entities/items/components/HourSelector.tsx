import React, { useState, useRef, useEffect } from 'react';
import { AddRemoveButton } from '@shared/components';
// @ts-ignore - animejs v4 types may not be fully compatible
import { animate } from 'animejs';

interface HourSelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HourSelector = React.memo(({ value, onIncrement, onDecrement }: HourSelectorProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (value !== previousValueRef.current && !isAnimating && valueRef.current) {
      animateCounter(value, previousValueRef.current);
      previousValueRef.current = value;
    }
  }, [value, isAnimating]);

  const animateCounter = (targetValue: number, startValue: number) => {
    if (!valueRef.current) return;

    setIsAnimating(true);
    const difference = targetValue - startValue;
    const absDifference = Math.abs(difference);
    // Faster: reduced from 400-1000ms to 150-400ms
    const duration = Math.min(400, Math.max(150, absDifference * 40));
    const direction = difference > 0 ? 1 : -1;

    const container = valueRef.current.parentElement;
    if (!container) return;

    // Create rolling numbers effect - simplified for speed
    const numbers: number[] = [];
    if (absDifference <= 3) {
      // For small differences, show all intermediate numbers
      for (let i = 0; i <= absDifference; i++) {
        numbers.push(startValue + i * direction);
      }
    } else {
      // For larger differences, just show start and end (faster)
      numbers.push(startValue);
      numbers.push(targetValue);
    }

    // Create rolling container
    const rollingContainer = document.createElement('div');
    rollingContainer.className = 'counter-rolling-container';
    numbers.forEach((num, index) => {
      const numElement = document.createElement('span');
      numElement.className = 'counter-rolling-number';
      numElement.textContent = String(num);
      numElement.style.transform = `translateY(${index * 100}%)`;
      rollingContainer.appendChild(numElement);
    });
    container.appendChild(rollingContainer);

    // Hide current value
    valueRef.current.style.opacity = '0';

    // Animate rolling - smoother easing
    const finalIndex = numbers.length - 1;
    animate(rollingContainer, {
      translateY: [`${-finalIndex * 100}%`, '0%'],
      duration: duration,
      easing: 'easeOutExpo',
      onComplete: () => {
        // Update display value
        if (valueRef.current) {
          valueRef.current.textContent = String(targetValue);
          valueRef.current.style.opacity = '1';
        }
        rollingContainer.remove();
        setDisplayValue(targetValue);
        setIsAnimating(false);
      }
    });
  };

  return (
    <div className="hour-selection-container full-width">
      <div className="button-group">
        <AddRemoveButton variant="remove" onClick={onDecrement} disabled={value <= 1 || isAnimating} />
        <div className="hour-value-container">
          <span ref={valueRef} className="hour-value">
            {displayValue}
          </span>
        </div>
        <AddRemoveButton variant="add" onClick={onIncrement} disabled={isAnimating} />
      </div>
    </div>
  );
});

HourSelector.displayName = 'HourSelector';
