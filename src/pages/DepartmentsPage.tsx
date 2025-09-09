import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  type GridSortModel,
  type GridRowId,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import DepartmentsDataGrid from "../components/DepartmentsDataGrid";
import {
  listDepartments,
  deleteDepartment,
  deleteDepartments,
  type SortOptions,
  type DepartmentWithIdAndManager,
} from "../services/departmentService";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentWithIdAndManager[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
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

        const data = await listDepartments(sortOptions);
        setDepartments(data);
      } catch (err) {
        console.error("ERRO na busca do Firebase:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, [sortModel]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const handleEditRow = (id: GridRowId) => {
    navigate(`/departamentos/editar/${id}`);
  };

  const handleDeleteRow = async (id: GridRowId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteDepartment(id as string);
      setDepartments((prev) => prev.filter((dep) => dep.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setError(err instanceof Error ? err.message : "Falha ao excluir.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = selectionModel as string[];
    try {
      setIsLoading(true);
      await deleteDepartments(idsToDelete);
      setDepartments((prev) =>
        prev.filter((dep) => !idsToDelete.includes(dep.id))
      );
      setSelectionModel([]);
    } catch (err) {
      console.error("Erro ao excluir em massa:", err);
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
          Departamentos
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/departamentos/novo"
        >
          Novo Departamento
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <DepartmentsDataGrid
        rows={departments}
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
