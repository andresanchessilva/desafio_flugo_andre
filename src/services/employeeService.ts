import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  type Timestamp,
  type Query,
} from "firebase/firestore";
import { db } from "./firebase";
import type { EmployeeStatusKey } from "../constants/employee";

export interface Employee {
  name: string;
  email: string;
  department: string;
  status: EmployeeStatusKey;
  createdAt: Timestamp;
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

export const listEmployees = async (
  sortOptions: SortOptions = {
    field: "createdAt",
    sort: "desc",
  }
): Promise<EmployeeWithId[]> => {
  try {
    const employeesCollection = collection(db, "employees");

    let queryRef: Query = employeesCollection;

    if (sortOptions && sortOptions.field) {
      queryRef = query(
        employeesCollection,
        orderBy(sortOptions.field, sortOptions.sort)
      );
    }

    const snapshot = await getDocs(queryRef);

    const employeesList: EmployeeWithId[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Employee),
    }));

    return employeesList;
  } catch (error) {
    console.error("Erro ao listar colaboradores:", error);
    throw new Error("Não foi possível carregar a lista de colaboradores.");
  }
};
