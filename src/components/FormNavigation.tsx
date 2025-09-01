import { Box, Button } from "@mui/material";

interface FormNavigationProps {
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading: boolean;
}

export default function FormNavigation({
  onBack,
  isFirstStep,
  isLastStep,
  isLoading,
}: FormNavigationProps) {
  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      <Button
        disabled={isFirstStep}
        variant="outlined"
        size="large"
        onClick={onBack}
        sx={{
          border: "none",
          color: "#000",
          "&.Mui-disabled": { border: "none" },
        }}
      >
        Voltar
      </Button>
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isLoading}
      >
        {isLastStep ? "Concluir" : "Próximo"}
      </Button>
    </Box>
  );
}
