import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { useManagers } from "../hooks/useManagers";

interface Props {
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
}

export default function ManagerSelect({ value, onChange, required }: Props) {
  const { managers, loading } = useManagers();

  return (
    <FormControl fullWidth required={required}>
      <InputLabel id="manager-label">Selecione um gestor</InputLabel>
      <Select
        label="Selecione um gestor"
        labelId="manager-label"
        value={loading ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        {loading ? (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              Carregando...
            </Box>
          </MenuItem>
        ) : (
          managers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>
              {manager.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
