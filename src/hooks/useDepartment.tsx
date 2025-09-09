import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { DepartmentWithId } from "../services/departmentService";

export function useDepartment(id?: string) {
  const [department, setDepartment] = useState<DepartmentWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "departments", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setDepartment({
            id: snapshot.id,
            ...((snapshot.data() as Omit<DepartmentWithId, "id">) || {}),
          });
        } else {
          setError("Departamento não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar departamento:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  return { department, loading, error };
}
