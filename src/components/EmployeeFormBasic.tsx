import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { IOSSwitch } from "./IOSSwitch";

interface Props {
  formData: { name: string; email: string; active: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmployeeFormBasic({ formData, onChange }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5" fontWeight="bold" color="textSecondary">
        Informações Básicas
      </Typography>

      <TextField
        label="Nome"
        name="name"
        value={formData.name}
        onChange={onChange}
        fullWidth
        required
      />

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={onChange}
        type="email"
        fullWidth
        required
      />

      <FormControl component="fieldset">
        <FormGroup row>
          <FormControlLabel
            control={
              <IOSSwitch
                checked={formData.active}
                onChange={onChange}
                name="active"
              />
            }
            label="Ativar ao criar"
            labelPlacement="end"
            slotProps={{
              typography: {
                marginLeft: 1,
                color: "text.secondary",
                fontWeight: 500,
                variant: "body2",
              },
            }}
            sx={{ marginLeft: 0, alignItems: "center" }}
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
}
