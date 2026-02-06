import { Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ForecastPage from "./pages/ForecastPage";
import MaterialsPage from "./pages/Materials/MaterialsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import SettingPage from "./pages/Settings/SettingsPage"

import DashboardLayout from "./components/Layout/DashboardLayout";

function App() {
  return (
    <div className="App">
      <Routes>

        {/* PUBLIC ROUTES (NO SIDEBAR) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* DASHBOARD ROUTES (WITH SIDEBAR) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingPage />} />

        </Route>

      </Routes>
    </div>
  );
}

export default App;
