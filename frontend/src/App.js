import logo from './logo.svg';
import './App.css';
import ForecastPage from './pages/ForecastPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Power Grid Inventory Forecasting</h1>
      </header>
      <main>
        <ForecastPage />
      </main>
    </div>
  );
}

export default App;
