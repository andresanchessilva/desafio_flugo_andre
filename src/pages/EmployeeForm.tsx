import React from "react";
import { Typography, Breadcrumbs, Link, Stack, Box } from "@mui/material";
import EmployeeFormStepper from "../components/EmployeeFormStepper";
import EmployeeFormProgress from "../components/EmployeeFormProgress";
import EmployeeFormBasic from "../components/EmployeeFormBasic";
import EmployeeFormProfessional from "../components/EmployeeFormProfessional";
import FormNavigation from "../components/FormNavigation";
import useEmployeeForm from "../hooks/useEmployeeForm";
import useFormStepper from "../hooks/useFormStepper";
import type { Dayjs } from "dayjs";

export default function EmployeesForm() {
  const steps = [
    { label: "Infos Básicas", component: EmployeeFormBasic },
    { label: "Infos Profissionais", component: EmployeeFormProfessional },
  ];

  const { activeStep, isLastStep, next, back } = useFormStepper(steps.length);
  const {
    formData,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleChangeDate,
    submitForm,
    handleDepartmentChange,
    handleChangeManager,
  } = useEmployeeForm({
    name: "",
    email: "",
    active: true,
    departmentId: "",
    hierarchicalLevel: "",
    position: "",
    admissionDate: null as Dayjs | null,
    baseSalary: "",
    managerId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLastStep()) {
      await submitForm();
      next();
    } else {
      next();
    }
  };

  const progressValue = (activeStep / steps.length) * 100;

  const safeStep = Math.min(activeStep, steps.length - 1);

  const renderStepContent = () => {
    switch (safeStep) {
      case 0:
        return (
          <EmployeeFormBasic formData={formData} onChange={handleInputChange} />
        );
      default:
        return (
          <EmployeeFormProfessional
            formData={formData}
            onChangeManager={handleChangeManager}
            handleDepartmentChange={handleDepartmentChange}
            onChangeDate={handleChangeDate}
            onChangeSelect={handleSelectChange}
            onChangeText={handleInputChange}
          />
        );
    }
  };

  return (
    <Stack spacing={3} pr={6}>
      <Breadcrumbs separator="•">
        <Link underline="hover" key="1" color="inherit" href="/colaboradores">
          Colaboradores
        </Link>
        <Typography key="2" sx={{ color: "text.primary" }}>
          Cadastrar Colaborador
        </Typography>
      </Breadcrumbs>

      <EmployeeFormProgress value={progressValue} />

      <Stack direction="row" spacing={2}>
        <Box width={180}>
          <EmployeeFormStepper activeStep={activeStep} steps={steps} />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          flexGrow={1}
        >
          <Box flexGrow={1} minHeight={550}>
            {renderStepContent()}
          </Box>

          <FormNavigation
            onBack={back}
            isFirstStep={activeStep === 0}
            isLastStep={isLastStep()}
            isLoading={isLoading}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
