import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../contexts/AuthContext";

export const useAuth = (): AuthContextType => useContext(AuthContext);
