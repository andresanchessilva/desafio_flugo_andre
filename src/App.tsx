import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import EmployeesPage from "./pages/EmployeesPage";
import EmployeesForm from "./pages/EmployeeForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/colaboradores" replace />} />
          <Route path="/colaboradores" element={<EmployeesPage />} />
          <Route path="/colaboradores/novo" element={<EmployeesForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
