'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function FormStepper({
  steps,
  currentStep,
  onStepClick,
}: FormStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <motion.button
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className="relative mb-4 focus:outline-none"
              whileHover={onStepClick ? { scale: 1.05 } : {}}
              whileTap={onStepClick ? { scale: 0.95 } : {}}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  index < currentStep
                    ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
                    : index === currentStep
                    ? 'bg-primary text-white shadow-lg ring-4 ring-primary/30'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>
            </motion.button>

            {/* Step Label */}
            <p
              className={`text-sm font-medium text-center ${
                index <= currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                {step.description}
              </p>
            )}

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 left-[60%] w-[calc(100%-20px)] h-1 transition-all ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-primary to-secondary'
                    : 'bg-muted'
                }`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {steps[currentStep]?.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}
