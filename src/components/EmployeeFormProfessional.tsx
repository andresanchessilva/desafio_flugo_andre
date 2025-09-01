import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface Props {
  formData: { department: string };
  onChange: (e: SelectChangeEvent) => void;
}

export default function EmployeeFormProfessional({
  formData,
  onChange,
}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" fontWeight="bold" color="textSecondary">
        Informações Profissionais
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="department-label">Selecione um departamento</InputLabel>
        <Select
          required
          name="department"
          label="Selecione um departamento"
          labelId="department-label"
          value={formData.department}
          onChange={onChange}
        >
          <MenuItem value="Design">Design</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Produto">Produto</MenuItem>
          <MenuItem value="TI">TI</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
