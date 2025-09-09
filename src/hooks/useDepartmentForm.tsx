import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../contexts/useSnackbar";
import {
  addDepartment,
  updateDepartment,
  type Department,
} from "../services/departmentService";
import {
  updateEmployee,
  type EmployeeWithId,
} from "../services/employeeService";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebase";

export interface DepartmentForm {
  id?: string;
  name: string;
  managerId: string;
  employees: string[];
}

export default function useDepartmentForm(initialData: DepartmentForm) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectManager = (managerId: string) => {
    setFormData((prev) => ({ ...prev, managerId }));
  };

  const handleEmployeeSelectionChange = (
    selectedEmployees: EmployeeWithId[]
  ) => {
    const employeeIds = selectedEmployees.map((employee) => employee.id);
    setFormData((prev) => ({ ...prev, employees: employeeIds }));
  };

  const submitForm = async () => {
    setIsLoading(true);

    try {
      const { id, employees = [], ...dataToSave } = formData;

      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departments = departmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Department),
      }));

      await Promise.all(
        departments.map((dept) => {
          const updatedEmployees = (dept.employees || []).filter(
            (empId) => !employees.includes(empId)
          );

          if (updatedEmployees.length !== (dept.employees?.length || 0)) {
            return updateDepartment(dept.id, { employees: updatedEmployees });
          }
          return Promise.resolve();
        })
      );

      let departmentId: string;
      if (id) {
        await updateDepartment(id, { ...dataToSave, employees });
        departmentId = id;
        showSnackbar("Departamento atualizado com sucesso!", "success");
      } else {
        const docRef = await addDepartment({ ...dataToSave, employees });
        departmentId = docRef.id;
        showSnackbar("Departamento criado com sucesso!", "success");
      }

      if (employees.length) {
        await Promise.all(
          employees.map((employeeId) =>
            updateEmployee(employeeId, { departmentId })
          )
        );
      }

      setTimeout(() => navigate("/departamentos"), 500);
    } catch (error) {
      console.error(error);
      showSnackbar("Erro ao salvar departamento!", "error");
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleInputChange,
    handleSelectManager,
    handleEmployeeSelectionChange,
    submitForm,
  };
}
