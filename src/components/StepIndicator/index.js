// components/StepIndicator/StepIndicator.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';

const StepIndicator = ({ currentStep, totalSteps = 4, tripType = 1 }) => {
  const { t } = useTranslation();

   // Define steps based on trip type
  const getStepLabels = () => {
    if (tripType === 3) { // Diving
      return [
        t('bookings.steps.pickup'),
        t('bookings.steps.agreement'),
        t('bookings.steps.contact'),
        t('bookings.steps.payment')
      ];
    } else { // Tour or Transfer
      return [
        t('bookings.steps.pickup'),
        t('bookings.steps.contact'),
        t('bookings.steps.payment')
      ];
    }
  };

  const stepLabels = getStepLabels();

  const getStepClass = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'inactive';
  };

  const getDividerClass = (step) => {
    return step < currentStep ? 'completed' : '';
  };

  return (
    <div className="step-indicator">
      <div className="step-container">
        {Array.from({ length: stepLabels.length }, (_, index) => {
          const step = index + 1;
          const stepClass = getStepClass(step);
          
          return (
            <React.Fragment key={step}>
              <div className="step-wrapper">
                <div className={`step-item ${stepClass}`}>
                  {step < currentStep ? <FaCheck /> : step}
                  {/* { step } */}
                </div>
                <div className={`step-label ${stepClass}`}>
                  {stepLabels[index]}
                </div>
              </div>
              
              {step < stepLabels.length && (
                <div className={`step-divider ${getDividerClass(step)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;