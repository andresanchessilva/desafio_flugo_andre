import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { type GridSortModel } from "@mui/x-data-grid";
import EmployeesDataGrid from "../components/EmployeesDataGrid";
import {
  listEmployees,
  type EmployeeWithId,
  type SortOptions,
} from "../services/employeeService";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

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

        const data = await listEmployees(sortOptions);
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
  }, [sortModel]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
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

      <EmployeesDataGrid
        rows={employees}
        isLoading={isLoading}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
      />
    </>
  );
}
