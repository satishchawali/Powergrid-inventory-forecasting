import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/forecast")
      .then(res => res.json())
      .then(data => setForecast(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="App">
      <h1>Power Grid Inventory Forecasting</h1>
      {forecast ? (
        <div>
          <p>Item: {forecast.item}</p>
          <p>Forecasted Demand: {forecast.forecasted_demand}</p>
          <p>Day: {forecast.day}</p>
          <p>Unit: {forecast.unit}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
