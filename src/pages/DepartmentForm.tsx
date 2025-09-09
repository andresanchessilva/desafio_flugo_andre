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
  TextField,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useDepartmentForm from "../hooks/useDepartmentForm";
import { useDepartment } from "../hooks/useDepartment";
import ManagerSelect from "../components/ManagerSelect";
import EmployeeAutocomplete from "../components/EmployeeAutocomplete";

export default function DepartmentForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { department, loading, error } = useDepartment(id);

  const {
    formData,
    setFormData,
    isLoading,
    handleInputChange,
    handleSelectManager,
    handleEmployeeSelectionChange,
    submitForm,
  } = useDepartmentForm({
    name: "",
    managerId: "",
    employees: [],
  });

  useEffect(() => {
    if (isEditMode && department) {
      setFormData({
        ...department,
        employees: department.employees ?? [],
      });
    }
  }, [department, isEditMode, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (isEditMode && loading) return <CircularProgress />;
  if (isEditMode && error) return <Alert severity="error">{error}</Alert>;

  const pageTitle = isEditMode ? "Editar Departamento" : "Novo Departamento";
  const buttonLabel = isEditMode ? "Salvar Alterações" : "Criar Departamento";

  const lockedEmployees = isEditMode ? department?.employees ?? [] : [];

  return (
    <Stack spacing={3} pr={6}>
      <Breadcrumbs separator="•">
        <Link underline="hover" color="inherit" href="/departamentos">
          Departamentos
        </Link>
        <Typography sx={{ color: "text.primary" }}>{pageTitle}</Typography>
      </Breadcrumbs>

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h5" fontWeight="bold" color="textSecondary">
            Informações do Departamento
          </Typography>

          <TextField
            label="Nome do Departamento"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            autoFocus
          />

          <ManagerSelect
            value={formData.managerId}
            onChange={handleSelectManager}
            required
          />
        </Box>

        <Divider />

        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h5" fontWeight="bold" color="textSecondary">
            Membros da Equipe
          </Typography>
          <EmployeeAutocomplete
            value={formData.employees}
            lockedEmployees={lockedEmployees}
            onChange={handleEmployeeSelectionChange}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            color="inherit"
            onClick={() => navigate("/departamentos")}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Salvando..." : buttonLabel}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}
