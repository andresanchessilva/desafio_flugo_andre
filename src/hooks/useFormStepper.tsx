import React from "react";

export default function useFormStepper(totalSteps: number) {
  const [activeStep, setActiveStep] = React.useState(0);
  const isLastStep = () => activeStep >= totalSteps - 1;
  const next = () => setActiveStep((prev) => prev + 1);
  const back = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return { activeStep, isLastStep, next, back };
}
