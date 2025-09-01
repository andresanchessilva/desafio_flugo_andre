import Box from "@mui/material/Box";
import Stepper, { type StepperProps } from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Typography, StepContent } from "@mui/material";

interface StepConfig {
  label: string;
  description?: string;
}

interface VerticalStepperProps extends StepperProps {
  activeStep: number;
  steps: StepConfig[];
}

export default function VerticalLinearStepper({
  activeStep,
  steps,
  ...rest
}: VerticalStepperProps) {
  const safeStep = Math.min(activeStep, steps.length);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={safeStep} orientation="vertical" {...rest}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={safeStep > index}>
            <StepLabel
              slotProps={{
                stepIcon: {
                  sx: {
                    "& .MuiStepIcon-text": {
                      fontWeight: "bold",
                    },

                    "&:not(.Mui-active):not(.Mui-completed)": {
                      color: "#DFE3E9",

                      "& .MuiStepIcon-text": {
                        fill: (theme) => theme.palette.text.secondary,
                      },
                    },
                  },
                },
              }}
            >
              {step.label}
            </StepLabel>

            <StepContent sx={{ paddingBottom: 4 }}>
              {step.description && <Typography>{step.description}</Typography>}
              {!step.description && <Box sx={{ minHeight: 50 }} />}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
