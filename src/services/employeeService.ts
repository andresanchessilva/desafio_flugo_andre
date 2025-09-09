import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  type Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  where,
  type WhereFilterOp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { EmployeeStatusKey } from "../constants/employee";

export interface EmployeeWithDepartment {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  department?: { id: string; name: string };
  status: string;
  position: string;
  admissionDate: Date | null;
  hierarchicalLevel: string;
  baseSalary: number;
  managerId: string;
}

export interface Employee {
  name: string;
  email: string;
  departmentId: string;
  status: EmployeeStatusKey;
  createdAt: Timestamp;
  position: string;
  admissionDate: Date | null;
  hierarchicalLevel: string;
  baseSalary: number;
  managerId: string;
}

export interface EmployeeWithId extends Employee {
  id: string;
}

export interface SortOptions {
  field: string;
  sort: "asc" | "desc";
}

export const addEmployee = async (
  employeeData: Omit<Employee, "createdAt">
) => {
  try {
    const dataWithTimestamp = {
      ...employeeData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "employees"), dataWithTimestamp);

    return docRef;
  } catch (error) {
    console.error("Erro ao adicionar colaborador:", error);
    throw new Error("Não foi possível salvar o colaborador.");
  }
};

export const updateEmployee = async (
  id: string,
  employeeData: Partial<Omit<Employee, "createdAt">>
) => {
  try {
    const docRef = doc(db, "employees", id);
    await updateDoc(docRef, employeeData);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar colaborador:", error);
    throw new Error("Não foi possível atualizar o colaborador.");
  }
};

export interface FilterOption {
  field: string;
  op: WhereFilterOp;
  value: string;
}

export const listEmployees = async (
  sortOptions: SortOptions = { field: "createdAt", sort: "desc" },
  filterOptions: FilterOption[] = []
): Promise<EmployeeWithDepartment[]> => {
  try {
    const employeesCollection = collection(db, "employees");

    const queryConstraints = [];

    if (filterOptions && filterOptions.length > 0) {
      filterOptions.forEach((filter) => {
        if (filter.value !== undefined && filter.value !== null) {
          queryConstraints.push(where(filter.field, filter.op, filter.value));
        }
      });
    }

    if (sortOptions?.field) {
      queryConstraints.push(orderBy(sortOptions.field, sortOptions.sort));
    }

    const queryRef = query(employeesCollection, ...queryConstraints);

    const snapshot = await getDocs(queryRef);

    const employeesList: EmployeeWithDepartment[] = await Promise.all(
      snapshot.docs.map(async (employeeDoc) => {
        const data = employeeDoc.data() as Omit<EmployeeWithDepartment, "id">;

        let department: { id: string; name: string } | undefined;
        if (data.departmentId) {
          const deptSnap = await getDoc(
            doc(db, "departments", data.departmentId)
          );
          if (deptSnap.exists()) {
            department = {
              id: deptSnap.id,
              ...(deptSnap.data() as { name: string }),
            };
          }
        }

        return {
          id: employeeDoc.id,
          ...data,
          department,
        };
      })
    );

    return employeesList;
  } catch (error) {
    console.error("Erro ao listar colaboradores:", error);
    throw new Error("Não foi possível carregar a lista de colaboradores.");
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const employeeRef = doc(db, "employees", id);
    const snap = await getDoc(employeeRef);

    if (!snap.exists()) return;

    const data = snap.data() as { departmentId?: string };

    if (data.departmentId) {
      const deptRef = doc(db, "departments", data.departmentId);
      const deptSnap = await getDoc(deptRef);

      if (deptSnap.exists()) {
        const deptData = deptSnap.data() as { employees?: string[] };
        const updatedEmployees = (deptData.employees || []).filter(
          (empId) => empId !== id
        );
        await updateDoc(deptRef, { employees: updatedEmployees });
      }
    }

    await deleteDoc(employeeRef);
  } catch (error) {
    console.error("Erro ao deletar colaborador:", error);
    throw new Error("Não foi possível deletar o colaborador.");
  }
};

export const deleteEmployees = async (ids: string[]) => {
  await Promise.all(ids.map((id) => deleteEmployee(id)));
};
