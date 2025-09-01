export const EMPLOYEE_STATUS = {
  ativo: {
    key: "ativo",
    label: "Ativo",
    color: "success",
  },
  inativo: {
    key: "inativo",
    label: "Inativo",
    color: "error",
  },
} as const;

export type EmployeeStatusKey = keyof typeof EMPLOYEE_STATUS;
