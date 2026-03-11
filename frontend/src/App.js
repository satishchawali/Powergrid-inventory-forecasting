import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ForecastPage from "./pages/ForecastPage";
import MaterialsPage from "./pages/Materials/MaterialsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import SettingPage from "./pages/Settings/SettingsPage";

import DashboardLayout from "./components/Layout/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
