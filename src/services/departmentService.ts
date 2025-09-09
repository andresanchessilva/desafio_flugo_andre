import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  type Query,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { EmployeeWithId } from "./employeeService";

export interface Department {
  name: string;
  managerId: string;
  employees?: string[];
  createdAt: Date | null;
}
export interface DepartmentWithId extends Department {
  id: string;
}

export interface DepartmentWithIdAndManager extends Department {
  id: string;
  manager: EmployeeWithId;
}

export interface SortOptions {
  field: string;
  sort: "asc" | "desc";
}

export const addDepartment = async (
  departmentData: Omit<Department, "createdAt">
) => {
  try {
    const dataWithTimestamp = {
      ...departmentData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "departments"),
      dataWithTimestamp
    );
    return docRef;
  } catch (error) {
    console.error("Erro ao adicionar departamento:", error);
    throw new Error("Não foi possível salvar o departamento.");
  }
};

export const updateDepartment = async (
  id: string,
  departmentData: Partial<Omit<Department, "createdAt">>
) => {
  try {
    const docRef = doc(db, "departments", id);

    const dataToUpdate = {
      ...departmentData,
      employees: departmentData.employees ?? [],
    };

    await updateDoc(docRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar departamento:", error);
    throw new Error("Não foi possível atualizar o departamento.");
  }
};

export const listDepartments = async (
  sortOptions: SortOptions = {
    field: "createdAt",
    sort: "desc",
  }
): Promise<DepartmentWithIdAndManager[]> => {
  try {
    const departmentsCollection = collection(db, "departments");
    let queryRef: Query = departmentsCollection;

    if (sortOptions && sortOptions.field) {
      queryRef = query(
        departmentsCollection,
        orderBy(sortOptions.field, sortOptions.sort)
      );
    }

    const snapshot = await getDocs(queryRef);

    const employeesSnapshot = await getDocs(collection(db, "employees"));
    const employeesMap = new Map(
      employeesSnapshot.docs.map((e) => [e.id, e.data() as EmployeeWithId])
    );

    const departmentsList = snapshot.docs.map((d) => {
      const data = d.data() as Department;
      return {
        id: d.id,
        ...data,
        manager: employeesMap.get(data.managerId) || null,
      };
    });

    return departmentsList as DepartmentWithIdAndManager[];
  } catch (error) {
    console.error("Erro ao listar departamentos:", error);
    throw new Error("Não foi possível carregar a lista de departamentos.");
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    return await deleteDoc(doc(db, "departments", id));
  } catch (error) {
    console.error("Erro ao deletar departamento:", error);
  }
};

export const deleteDepartments = async (ids: string[]) => {
  const promises = ids.map((id) => deleteDepartment(id));
  await Promise.all(promises);
};

export const getDepartment = async (id: string): Promise<DepartmentWithId> => {
  const docRef = doc(db, "departments", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Departamento não encontrado.");
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<DepartmentWithId, "id">),
  };
};
