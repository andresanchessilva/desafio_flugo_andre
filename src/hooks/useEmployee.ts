import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { EmployeeWithId } from "../services/employeeService";

export function useEmployee(id: string | undefined) {
  const [employee, setEmployee] = useState<EmployeeWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, "employees", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data() as Omit<EmployeeWithId, "id">;
          setEmployee({ id: snap.id, ...data });
        } else {
          setError("Colaborador não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar colaborador:", err);
        setError("Não foi possível carregar o colaborador.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}
