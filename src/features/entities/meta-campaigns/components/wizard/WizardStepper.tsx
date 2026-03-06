import React from 'react';

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="meta-wizard-stepper">
      {steps.map((label, idx) => (
        <div
          key={idx}
          className={`meta-wizard-stepper__step ${
            idx < currentStep ? 'meta-wizard-stepper__step--completed' :
            idx === currentStep ? 'meta-wizard-stepper__step--active' :
            'meta-wizard-stepper__step--pending'
          }`}
        >
          <div className="meta-wizard-stepper__number">
            {idx < currentStep ? '\u2713' : idx + 1}
          </div>
          <span className="meta-wizard-stepper__label">{label}</span>
          {idx < steps.length - 1 && <div className="meta-wizard-stepper__line" />}
        </div>
      ))}
    </div>
  );
};
