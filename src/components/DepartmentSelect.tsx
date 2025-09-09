import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { useDepartments } from "../hooks/useDepartments";

interface Props {
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
  allowNull?: boolean;
}

export default function DepartmentSelect({
  value,
  onChange,
  required,
  allowNull,
}: Props) {
  const { departments, loading } = useDepartments();

  return (
    <FormControl fullWidth required={required}>
      <InputLabel id="department-label">Selecione um departamento</InputLabel>
      <Select
        label="Selecione um departamento"
        labelId="department-label"
        value={loading ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        {allowNull && (
          <MenuItem value="">
            <em>Nenhum</em>
          </MenuItem>
        )}

        {loading ? (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              Carregando...
            </Box>
          </MenuItem>
        ) : (
          departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
