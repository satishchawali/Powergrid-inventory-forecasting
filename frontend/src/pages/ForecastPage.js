import React, { useState, useEffect } from 'react';
import { getForecast } from '../services/api';
import ForecastDisplay from '../components/ForecastDisplay';

const ForecastPage = () => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Default fetch for day 5 as per original code
        getForecast(5)
            .then(data => {
                setForecast(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load forecast.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="forecast-page">
            <h2>Inventory Forecast</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {forecast && <ForecastDisplay data={forecast} />}
        </div>
    );
};

export default ForecastPage;
