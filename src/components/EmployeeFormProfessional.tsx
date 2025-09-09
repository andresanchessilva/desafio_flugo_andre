import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import CurrencyField from "./CurrencyField";
import ManagerSelect from "./ManagerSelect";
import DepartmentSelect from "./DepartmentSelect";

interface Props {
  formData: {
    departmentId: string;
    position: string;
    admissionDate: Dayjs | null;
    hierarchicalLevel: string;
    baseSalary: string;
    managerId: string;
  };
  onChangeSelect: (e: SelectChangeEvent) => void;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDate: (newValue: Dayjs | null) => void;

  onChangeManager: (id: string) => void;

  handleDepartmentChange: (id: string) => void;
}

export default function EmployeeFormProfessional({
  formData,
  onChangeSelect,
  onChangeText,
  onChangeDate,
  handleDepartmentChange,
  onChangeManager,
}: Props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h5" fontWeight="bold" color="textSecondary">
          Informações Profissionais
        </Typography>

        <DepartmentSelect
          required
          value={formData.departmentId}
          onChange={handleDepartmentChange}
        />

        <TextField
          label="Cargo"
          name="position"
          value={formData.position}
          onChange={onChangeText}
          fullWidth
          required
        />

        <FormControl fullWidth>
          <InputLabel id="hierarchical-level-label">
            Selecione um nível hierárquico
          </InputLabel>
          <Select
            required
            name="hierarchicalLevel"
            label="Selecione um nível hierárquico"
            labelId="hierarchical-level-label"
            value={formData.hierarchicalLevel}
            onChange={onChangeSelect}
          >
            <MenuItem value="junior">Júnior</MenuItem>
            <MenuItem value="pleno">Pleno</MenuItem>
            <MenuItem value="senior">Sênior</MenuItem>
            <MenuItem value="gestor">Gestor</MenuItem>
          </Select>
        </FormControl>

        <ManagerSelect
          required={formData.hierarchicalLevel !== "gestor"}
          value={formData.managerId}
          onChange={onChangeManager}
        />

        <CurrencyField
          label="Salário Base"
          fullWidth
          required
          value={formData.baseSalary}
          onChange={(val: string) =>
            onChangeText({
              target: {
                name: "baseSalary",
                value: val,
              } as unknown as HTMLInputElement,
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />

        <DatePicker
          label="Data de Admissão"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={onChangeDate}
          disableFuture
          minDate={dayjs("1900-01-01")}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
