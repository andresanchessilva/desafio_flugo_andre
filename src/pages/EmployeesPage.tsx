import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  TextField,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  type GridSortModel,
  type GridRowId,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import EmployeesDataGrid from "../components/EmployeesDataGrid";
import DepartmentSelect from "../components/DepartmentSelect";

import {
  listEmployees,
  deleteEmployee,
  deleteEmployees,
  type FilterOption,
  type SortOptions,
  type EmployeeWithDepartment,
} from "../services/employeeService";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let sortOptions: SortOptions | undefined = undefined;
        if (sortModel.length > 0) {
          sortOptions = {
            field: sortModel[0].field,
            sort: sortModel[0].sort as "asc" | "desc",
          };
        }

        const backendFilters: FilterOption[] = [];

        if (departmentFilter) {
          backendFilters.push({
            field: "departmentId",
            op: "==",
            value: departmentFilter,
          });
        }

        if (nameFilter) {
          backendFilters.push({ field: "name", op: ">=", value: nameFilter });
          backendFilters.push({
            field: "name",
            op: "<=",
            value: nameFilter + "\uf8ff",
          });
        }

        if (emailFilter) {
          backendFilters.push({ field: "email", op: ">=", value: emailFilter });
          backendFilters.push({
            field: "email",
            op: "<=",
            value: emailFilter + "\uf8ff",
          });
        }

        const data = await listEmployees(sortOptions, backendFilters);
        setEmployees(data);
      } catch (err) {
        console.error("ERRO na busca do Firebase:", err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [sortModel, nameFilter, emailFilter, departmentFilter]);

  const handleSortModelChange = (newModel: GridSortModel) =>
    setSortModel(newModel);
  const handleEditRow = (id: GridRowId) =>
    navigate(`/colaboradores/editar/${id}`);
  const handleDeleteRow = async (id: GridRowId) => {
    try {
      setIsLoading(true);
      await deleteEmployee(id as string);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setError(
        err instanceof Error ? err.message : "Falha ao excluir colaborador."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleBulkDelete = async () => {
    const idsToDelete = selectionModel as string[];
    try {
      setIsLoading(true);
      await deleteEmployees(idsToDelete);
      setEmployees((prev) =>
        prev.filter((emp) => !idsToDelete.includes(emp.id))
      );
      setSelectionModel([]);
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setError(
        err instanceof Error ? err.message : "Falha ao excluir em massa."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Colaboradores
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/colaboradores/novo"
        >
          Novo Colaborador
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack display="flex" gap={2} mb={2} flexDirection="row">
        <TextField
          fullWidth
          label="Nome"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <DepartmentSelect
          value={departmentFilter}
          onChange={setDepartmentFilter}
        />
      </Stack>

      <EmployeesDataGrid
        rows={employees}
        isLoading={isLoading}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        onEditRow={handleEditRow}
        onDeleteRow={handleDeleteRow}
        onBulkDelete={handleBulkDelete}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={setSelectionModel}
      />
    </>
  );
}
