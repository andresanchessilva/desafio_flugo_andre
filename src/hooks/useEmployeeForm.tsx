import type { SelectChangeEvent } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../contexts/useSnackbar";
import { addEmployee, updateEmployee } from "../services/employeeService";
import { EMPLOYEE_STATUS } from "../constants/employee";
import type { Dayjs } from "dayjs";
import { getDepartment, updateDepartment } from "../services/departmentService";

interface EmployeeForm {
  id?: string;
  name: string;
  email: string;
  departmentId: string;
  active: boolean;
  position: string;
  admissionDate: Dayjs | null;
  hierarchicalLevel: string;
  baseSalary: string;
  managerId: string;
}

export default function useEmployeeForm(initialData: EmployeeForm) {
  const [formData, setFormData] = React.useState<EmployeeForm>(initialData);
  const [originalDepartmentId, setOriginalDepartmentId] = React.useState<
    string | null
  >(initialData?.id ? initialData.departmentId ?? null : null);
  const prevIdRef = useRef<string | undefined>(initialData?.id);
  const [isLoading, setIsLoading] = React.useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.id && prevIdRef.current !== formData.id) {
      setOriginalDepartmentId(formData.departmentId ?? null);
      prevIdRef.current = formData.id;
    }
  }, [formData.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDepartmentChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      departmentId: id,
    }));
  };

  const handleChangeManager = (id: string) => {
    setFormData((prev) => ({ ...prev, managerId: id }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDate = (newValue: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, admissionDate: newValue }));
  };

  const submitForm = async () => {
    setIsLoading(true);

    try {
      const { active, admissionDate, baseSalary, id, departmentId, ...rest } =
        formData;

      const salaryNumber = parseFloat(
        baseSalary.replace(/\./g, "").replace(",", ".")
      );
      if (!salaryNumber || salaryNumber <= 0) {
        showSnackbar("Informe um salário válido!", "error");
        setIsLoading(false);
        return;
      }

      const dataToSave = {
        ...rest,
        departmentId,
        baseSalary: salaryNumber,
        admissionDate: admissionDate ? admissionDate.toDate() : null,
        status: active
          ? EMPLOYEE_STATUS.ativo.key
          : EMPLOYEE_STATUS.inativo.key,
      };

      let employeeId: string;

      if (id) {
        await updateEmployee(id, dataToSave);
        employeeId = id;
        showSnackbar("Colaborador atualizado com sucesso!", "success");
      } else {
        const docRef = await addEmployee(dataToSave);
        employeeId = docRef.id;
        showSnackbar("Colaborador cadastrado com sucesso!", "success");
      }

      if (id && originalDepartmentId && originalDepartmentId !== departmentId) {
        const prevDept = await getDepartment(originalDepartmentId);

        const newEmployees = (prevDept.employees || []).filter(
          (eId) => eId !== employeeId
        );
        await updateDepartment(originalDepartmentId, {
          employees: newEmployees,
        });
      }

      if (departmentId) {
        const dept = await getDepartment(departmentId);

        const updatedEmployees = Array.from(
          new Set([...(dept.employees || []), employeeId])
        );
        await updateDepartment(departmentId, { employees: updatedEmployees });
      }

      setOriginalDepartmentId(departmentId ?? null);

      setTimeout(() => navigate("/colaboradores"), 1000);
    } catch (error) {
      console.error(error);
      showSnackbar("Erro ao salvar colaborador!", "error");
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    setFormData,
    handleInputChange,
    handleDepartmentChange,
    handleSelectChange,
    handleChangeDate,
    handleChangeManager,
    submitForm,
  };
}
