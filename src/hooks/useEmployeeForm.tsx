import type { SelectChangeEvent } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../contexts/useSnackbar";
import { addEmployee } from "../services/employeeService";
import { EMPLOYEE_STATUS } from "../constants/employee";

interface EmployeeForm {
  name: string;
  email: string;
  department: string;
  active: boolean;
}

export default function useEmployeeForm(initialData: EmployeeForm) {
  const [formData, setFormData] = React.useState(initialData);
  const [isLoading, setIsLoading] = React.useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const { active, ...rest } = formData;
      const dataToSave = {
        ...rest,
        status: active
          ? EMPLOYEE_STATUS.ativo.key
          : EMPLOYEE_STATUS.inativo.key,
      };

      await addEmployee(dataToSave);
      showSnackbar("Colaborador cadastrado com sucesso!", "success");

      setTimeout(() => {
        navigate("/colaboradores");
      }, 1000);
    } catch (error) {
      console.error(`Erro: ${error}`);
      showSnackbar("Erro ao cadastrar colaborador!", "error");
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSelectChange,
    submitForm,
  };
}
