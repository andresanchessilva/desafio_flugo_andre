import { Box, Avatar, Typography, Chip } from "@mui/material";
import {
  type GridColDef,
  type GridSortModel,
  DataGrid,
} from "@mui/x-data-grid";
import type { EmployeeWithId } from "../services/employeeService";
import { EMPLOYEE_STATUS, type EmployeeStatusKey } from "../constants/employee";

const columns: GridColDef<EmployeeWithId>[] = [
  {
    field: "name",
    headerName: "Nome",
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
        <Avatar
          src={`https://api.dicebear.com/9.x/big-smile/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${params.row.id}`}
        />
        <Typography
          variant="body2"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {params.row.name}
        </Typography>
      </Box>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
  {
    field: "department",
    headerName: "Departamento",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => {
      const statusKey = params.value as EmployeeStatusKey;
      const statusInfo = EMPLOYEE_STATUS[statusKey];
      if (!statusInfo) return null;

      const colorKey = `${statusInfo.color}Chip` as const;
      return (
        <Chip
          label={statusInfo.label}
          size="small"
          sx={{
            fontWeight: "bold",
            borderRadius: 1,
            color: (theme) => theme.palette[colorKey]?.main,
            backgroundColor: (theme) => theme.palette[colorKey]?.background,
          }}
        />
      );
    },
  },
];

interface EmployeesDataGridProps {
  rows: EmployeeWithId[];
  isLoading: boolean;
  sortModel?: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
}

export default function EmployeesDataGrid({
  rows,
  isLoading,
  sortModel,
  onSortModelChange,
}: EmployeesDataGridProps) {
  console.log(rows);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowHeight={72}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        sx={{
          borderRadius: 5,
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.12)",
          border: "none",
          "& .MuiDataGrid-cell": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "8px 16px",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#F5F6F8",
            borderBottom: "none !important",
            padding: "8px 16px",
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
            {
              outline: "none",
            },
        }}
      />
    </Box>
  );
}
