import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import EmployeesPage from "./pages/EmployeesPage";
import EmployeesForm from "./pages/EmployeeForm";
import EmployeeEditForm from "./pages/EmployeeEditForm";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentForm from "./pages/DepartmentForm";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={<Navigate to="/colaboradores" replace />}
            />
            <Route path="/colaboradores" element={<EmployeesPage />} />
            <Route path="/colaboradores/novo" element={<EmployeesForm />} />
            <Route
              path="/colaboradores/editar/:id"
              element={<EmployeeEditForm />}
            />
            <Route path="/departamentos" element={<DepartmentsPage />} />
            <Route path="/departamentos/novo" element={<DepartmentForm />} />
            <Route
              path="/departamentos/editar/:id"
              element={<DepartmentForm />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
