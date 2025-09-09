import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { DepartmentWithId } from "../services/departmentService";

export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const colRef = collection(db, "departments");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<DepartmentWithId, "id">),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setDepartments(data);
      } catch (err) {
        console.error("Erro ao buscar departamentos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}
