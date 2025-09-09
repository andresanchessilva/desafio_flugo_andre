import React, { useEffect } from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeFormBasic from "../components/EmployeeFormBasic";
import EmployeeFormProfessional from "../components/EmployeeFormProfessional";
import useEmployeeForm from "../hooks/useEmployeeForm";
import { useEmployee } from "../hooks/useEmployee";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Timestamp } from "firebase/firestore";

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function EmployeeEditForm() {
  const { id } = useParams<{ id: string }>();
  const { employee, loading, error } = useEmployee(id);
  const navigate = useNavigate();

  const {
    formData,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleChangeDate,
    handleChangeManager,
    handleDepartmentChange,
    setFormData,
    submitForm,
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

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        active: employee.status === "ativo",
        departmentId: employee.departmentId,
        hierarchicalLevel: employee.hierarchicalLevel || "",
        position: employee.position,
        admissionDate: employee.admissionDate
          ? dayjs((employee.admissionDate as unknown as Timestamp).toDate())
          : null,
        baseSalary: formatCurrency(employee.baseSalary),
        managerId: employee.managerId || "",
      });
    }
  }, [employee, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!employee) return null;

  return (
    <Stack spacing={3} pr={6}>
      <Breadcrumbs separator="•">
        <Link underline="hover" key="1" color="inherit" href="/colaboradores">
          Colaboradores
        </Link>
        <Typography key="2" sx={{ color: "text.primary" }}>
          Editar Colaborador
        </Typography>
      </Breadcrumbs>

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <EmployeeFormBasic formData={formData} onChange={handleInputChange} />
        <EmployeeFormProfessional
          formData={formData}
          handleDepartmentChange={handleDepartmentChange}
          onChangeDate={handleChangeDate}
          onChangeSelect={handleSelectChange}
          onChangeText={handleInputChange}
          onChangeManager={handleChangeManager}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            color="inherit"
            onClick={() => navigate("/colaboradores")}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}
