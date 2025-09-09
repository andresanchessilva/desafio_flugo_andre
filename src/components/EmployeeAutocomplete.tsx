import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Chip } from "@mui/material";
import {
  listEmployees,
  type EmployeeWithDepartment,
  type EmployeeWithId,
} from "../services/employeeService";

interface Props {
  value: string[];
  lockedEmployees: string[];
  onChange: (selectedEmployees: EmployeeWithId[]) => void;
  label?: string;
}

export default function EmployeeAutocomplete({
  value,
  lockedEmployees,
  onChange,
  label = "Membros do Departamento",
}: Props) {
  const [allEmployees, setAllEmployees] = useState<EmployeeWithDepartment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await listEmployees();

        data.sort((a, b) => a.name.localeCompare(b.name));

        setAllEmployees(data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const selectedEmployeeObjects = allEmployees.filter((e) =>
    value.includes(e.id)
  );

  return (
    <Autocomplete
      multiple
      options={allEmployees}
      value={selectedEmployeeObjects}
      loading={loading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_, newValue) => {
        const preserved = allEmployees.filter((e) =>
          lockedEmployees.includes(e.id)
        );

        const finalList = Array.from(
          new Set([...preserved, ...newValue])
        ) as EmployeeWithId[];

        onChange(finalList);
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const isLocked = lockedEmployees.includes(option.id);
          return (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.name}
              color={isLocked ? "default" : "primary"}
              onDelete={isLocked ? undefined : getTagProps({ index }).onDelete}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Selecione colaboradores"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
