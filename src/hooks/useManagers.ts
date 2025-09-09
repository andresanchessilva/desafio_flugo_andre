import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

interface Manager {
  id: string;
  name: string;
}

export function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const q = query(
          collection(db, "employees"),
          where("hierarchicalLevel", "==", "gestor")
        );
        const snapshot = await getDocs(q);

        const list: Manager[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        list.sort((a, b) => a.name.localeCompare(b.name));
        setManagers(list);

        setManagers(list);
      } catch (err) {
        console.error("Erro ao buscar gestores:", err);
        setError("Não foi possível carregar gestores.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return { managers, loading, error };
}
