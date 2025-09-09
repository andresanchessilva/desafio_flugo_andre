import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  type GridColDef,
  type GridSortModel,
  DataGrid,
  GridActionsCellItem,
  type GridRowId,
  type GridRowSelectionModel,
  GridFooter,
  GridFooterContainer,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { DepartmentWithIdAndManager } from "../services/departmentService";
import { useSnackbar } from "../contexts/useSnackbar";

interface DepartmentsDataGridProps {
  rows: DepartmentWithIdAndManager[];
  isLoading: boolean;
  sortModel?: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onEditRow: (id: GridRowId) => void;
  onDeleteRow: (id: GridRowId) => void;
  onBulkDelete: (ids: string[]) => void;
  rowSelectionModel: GridRowSelectionModel;
  onRowSelectionModelChange: (model: GridRowSelectionModel) => void;
}

function CustomFooter({
  selectionModel,
  onBulkDeleteClick,
}: {
  selectionModel: string[];
  onBulkDeleteClick: () => void;
}) {
  return (
    <GridFooterContainer>
      {selectionModel.length > 0 ? (
        <Button
          variant="contained"
          color="error"
          onClick={onBulkDeleteClick}
          sx={{ ml: 2 }}
        >
          Excluir Selecionados ({selectionModel.length})
        </Button>
      ) : (
        <span style={{ marginLeft: 16, fontSize: 14, color: "#555" }}></span>
      )}
      <GridFooter />
    </GridFooterContainer>
  );
}

export default function DepartmentsDataGrid({
  rows,
  isLoading,
  sortModel,
  onSortModelChange,
  onEditRow,
  onDeleteRow,
  onBulkDelete,
  rowSelectionModel,
  onRowSelectionModelChange,
}: DepartmentsDataGridProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "single"; id: GridRowId } | { type: "bulk"; ids: string[] } | null
  >(null);
  const { showSnackbar } = useSnackbar();

  const handleOpenDeleteSingle = (id: GridRowId) => {
    setDeleteTarget({ type: "single", id });
    setOpenDialog(true);
  };

  const handleOpenDeleteBulk = () => {
    setDeleteTarget({ type: "bulk", ids: rowSelectionModel as string[] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.type === "single") {
      const dept = rows.find((row) => row.id === deleteTarget.id);
      if (dept && dept.employees!.length > 0) {
        showSnackbar(
          "Não é possível excluir um departamento que possui colaboradores.",
          "error"
        );
        handleCloseDialog();
        return;
      }
      onDeleteRow(deleteTarget.id);
    } else if (deleteTarget?.type === "bulk") {
      const invalidDepts = rows.filter(
        (row) =>
          deleteTarget.ids.includes(row.id) && (row.employees?.length ?? 0) > 0
      );

      if (invalidDepts.length > 0) {
        showSnackbar(
          `Os seguintes departamentos não podem ser excluídos pois possuem colaboradores: ${invalidDepts
            .map((d) => d.name)
            .join(", ")}`,
          "error"
        );
        handleCloseDialog();
        return;
      }

      onBulkDelete(deleteTarget.ids);
    }

    handleCloseDialog();
  };

  const columns: GridColDef<DepartmentWithIdAndManager>[] = [
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "manager",
      headerName: "Gestor",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {params.row.manager.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "employees",
      headerName: "Qtd. Usuários",
      flex: 1,
      renderCell: (params) => params.value?.length ?? 0,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      align: "right",
      headerAlign: "right",
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEditRow(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Excluir"
          onClick={() => handleOpenDeleteSingle(id)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        onCellClick={(params) => {
          if (params.field === "__check__" || params.field === "actions") {
            return;
          }

          onEditRow(params.id);
        }}
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowHeight={72}
        sortingMode="server"
        sortModel={sortModel}
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        onSortModelChange={onSortModelChange}
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          footer: () => (
            <CustomFooter
              selectionModel={rowSelectionModel as string[]}
              onBulkDeleteClick={handleOpenDeleteBulk}
            />
          ),
        }}
        sx={{
          borderRadius: 5,
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.12)",
          border: "none",
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "8px 16px",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#F5F6F8",
            borderBottom: "none !important",
            padding: "8px 16px 8px 4px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            color: (theme) => theme.palette.text.secondary,
          },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-footerContainer": { borderTop: "none" },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            { outline: "none" },
        }}
      />

      {deleteTarget && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {deleteTarget.type === "single"
                ? "Deseja excluir este departamento?"
                : `Deseja excluir ${deleteTarget.ids.length} departamentos?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              color="error"
              autoFocus
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
