import React from 'react';

const ForecastDisplay = ({ data }) => {
    if (!data) return null;

    return (
        <div className="forecast-result">
            <h3>Forecast Result</h3>
            <p><strong>Item:</strong> {data.item}</p>
            <p><strong>Day:</strong> {data.day}</p>
            <p><strong>Forecasted Demand:</strong> {data.forecasted_demand} {data.unit}</p>
        </div>
    );
};

export default ForecastDisplay;
