import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";

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
              <Switch
                checked={formData.active}
                onChange={onChange}
                name="active"
                color="primary"
              />
            }
            label="Ativar ao criar"
            labelPlacement="end"
            slotProps={{
              typography: {
                color: "text.secondary",
                fontWeight: 500,
              },
            }}
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
}
