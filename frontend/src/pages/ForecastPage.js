import React, { useState } from 'react';
import { getForecast } from '../services/api';
import './ForecastPage.css';

const ForecastPage = () => {
    const [formData, setFormData] = useState({
        budget: '',
        location: '',
        towerType: '',
        period: ''
    });

    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.budget || !formData.location || !formData.towerType || !formData.period) {
            setError("Please fill in all parameters before generating the forecast.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getForecast(formData.period === '1 Year' ? 365 : 180);
            setForecastData(data);
        } catch (err) {
            console.error(err);
            setError("Failed to generate forecast. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const SVGChart = ({ data }) => {
        if (!data) return null;

        const combined = [...data.historical, ...data.forecasted];
        const width = 900;
        const height = 400;
        const padding = 60;

        const maxDemand = Math.max(...combined.map(d => d.demand)) * 1.2 || 30000;
        const xStep = (width - padding * 2) / (combined.length - 1 || 1);

        const getPoints = (pointsData, startIndex) => pointsData.map((d, i) => ({
            x: padding + (startIndex + i) * xStep,
            y: height - padding - (d.demand / maxDemand) * (height - padding * 2),
            label: d.label,
            val: d.demand
        }));

        const hPoints = getPoints(data.historical, 0);
        const fPoints = getPoints(data.forecasted, data.historical.length - 1);

        const hPath = `M ${hPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
        const fPath = `M ${fPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

        return (
            <div className="chart-wrapper">
                <svg viewBox={`0 0 ${width} ${height}`} className="forecast-chart-svg">
                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
                        </filter>
                    </defs>

                    {[0, 5000, 10000, 15000, 20000, 25000].map(val => {
                        const y = height - padding - (val / maxDemand) * (height - padding * 2);
                        return (
                            <g key={val}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} className="axis-line" strokeDasharray="4 4" />
                                <text x={padding - 10} y={y + 5} textAnchor="end" className="axis-label">{val.toLocaleString()}</text>
                            </g>
                        );
                    })}

                    <path d={hPath} className="chart-line historical" />
                    <path d={fPath} className="chart-line forecasted" strokeDasharray="8 6" />

                    {hPoints.map((p, i) => (
                        <circle key={`h-${i}`} cx={p.x} cy={p.y} r="6" className="point historical" />
                    ))}
                    {fPoints.map((p, i) => (
                        <circle key={`f-${i}`} cx={p.y} cy={p.y} r="6" className="point forecasted" />
                    ))}

                    {combined.map((d, i) => (
                        <text key={i} x={padding + i * xStep} y={height - 20} textAnchor="middle" className="axis-label x-axis">{d.label}</text>
                    ))}

                    <text x={15} y={height / 2} transform={`rotate(-90, 15, ${height / 2})`} textAnchor="middle" className="axis-title">Demand (Metric Tons)</text>
                    <text x={width / 2} y={height - 5} textAnchor="middle" className="axis-title">Time Period</text>
                </svg>

                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="dot historical"></span> Historical Data
                    </div>
                    <div className="legend-item">
                        <span className="dot forecasted"></span> Forecasted Data
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="forecast-container refinement page-container">
            <div className="page-header">
                <div className="header-info">
                    <h1>Material Demand Forecasting</h1>
                    <p className="subtitle">Generate accurate forecasts for power grid infrastructure materials</p>
                </div>
            </div>

            <div className="forecast-main-grid">
                <div className="params-card">
                    <div className="card-title-group">
                        <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3v18h18" />
                            <path d="M18 17l-6-6-4 4-5-5" />
                        </svg>
                        <h3>Forecast Parameters</h3>
                    </div>
                    <p className="card-subtitle">Configure the parameters for material demand forecasting</p>

                    <div className="form-group">
                        <label>Project Budget (₹ Crores)</label>
                        <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Project Location</label>
                        <select name="location" value={formData.location} onChange={handleInputChange}>
                            <option value="">Select Region...</option>
                            <option value="Southern Region">Southern Region</option>
                            <option value="Northern Region">Northern Region</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tower Type</label>
                        <select name="towerType" value={formData.towerType} onChange={handleInputChange}>
                            <option value="">Select Tower Type...</option>
                            <option value="Distribution Tower">Distribution Tower</option>
                            <option value="Transmission Tower">Transmission Tower</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Forecast Period</label>
                        <select name="period" value={formData.period} onChange={handleInputChange}>
                            <option value="">Select Period...</option>
                            <option value="1 Year">1 Year</option>
                            <option value="6 Months">6 Months</option>
                        </select>
                    </div>

                    <button className={`generate-btn active dark ${loading ? 'loading' : ''}`} onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Forecast'}
                    </button>
                    {error && <p className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '12px' }}>{error}</p>}
                </div>

                <div className="chart-card">
                    <div className="card-title-group">
                        <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        <h3>Demand Forecast Chart</h3>
                    </div>
                    <p className="card-subtitle">Historical and forecasted material demand trends</p>

                    <div className="chart-content">
                        {loading && <div className="loading-overlay"><div className="spinner"></div></div>}
                        {!forecastData && !loading ? (
                            <div className="chart-placeholder">
                                <p>Click Generate to see historical vs forecasted trends</p>
                            </div>
                        ) : (
                            <SVGChart data={forecastData} />
                        )}
                    </div>
                </div>
            </div>

            <div className="breakdown-card">
                <div className="card-title-group">
                    <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                    <h3>Material Breakdown</h3>
                </div>
                <p className="card-subtitle">Detailed forecast of material requirements</p>

                <div className="table-responsive">
                    {forecastData ? (
                        <table className="breakdown-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forecastData.breakdown.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="bold">{row.material}</td>
                                        <td>{row.category}</td>
                                        <td className="bold">{row.quantity}</td>
                                        <td>{row.unit}</td>
                                        <td>
                                            <span className={`conf-badge ${parseInt(row.confidence) > 90 ? 'high' : 'med'}`}>
                                                {row.confidence}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="chart-placeholder">
                            <p>Generate a forecast to view the material breakdown</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForecastPage;
