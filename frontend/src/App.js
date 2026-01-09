import { Routes, Route } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import ForecastPage from './pages/ForecastPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import HomePage from './pages/Home/HomePage';
import DashboardPage from "./pages/Dashboard/DashboardPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forecast" element={
          <>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1>Power Grid Inventory Forecasting</h1>
            </header>
            <main>
              <ForecastPage />
            </main>
          </>
        } />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
