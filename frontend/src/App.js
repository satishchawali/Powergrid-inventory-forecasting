import { Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import ForecastPage from './pages/ForecastPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="App">
      <Routes>
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
