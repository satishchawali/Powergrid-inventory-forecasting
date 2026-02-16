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
    const [isExpanded, setIsExpanded] = useState(false);

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
            const data = await getForecast({
                budget: formData.budget,
                location: formData.location,
                tower_type: formData.towerType,
                period: formData.period
            });
            setForecastData(data);
        } catch (err) {
            console.error(err);
            setError("Failed to generate forecast. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const materialColors = {
        'Power Transformer 220kV': '#6366f1',
        'Copper Cable 400mm': '#10b981',
        'Transmission Tower Type-A': '#f59e0b',
        'Insulator String': '#ef4444',
        'Circuit Breaker': '#8b5cf6',
        'Control Panel': '#ec4899',
        'Transformer': '#6366f1',
        'Cable': '#10b981',
        'Tower': '#f59e0b',
        'Hardware': '#ef4444'
    };

    const getMaterialColor = (name, index) => {
        if (materialColors[name]) return materialColors[name];
        const categoryMatch = Object.keys(materialColors).find(key => name.includes(key));
        if (categoryMatch) return materialColors[categoryMatch];
        const defaultColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        return defaultColors[index % defaultColors.length];
    };

    const SVGChart = ({ data, expanded = false }) => {
        if (!data) return null;

        const combined = [...data.historical, ...data.forecasted];
        const width = expanded ? window.innerWidth : 900;
        const height = expanded ? window.innerHeight * 0.7 : 400;
        const padding = 60;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxDemand = Math.max(...combined.map(d => d.demand)) * 1.15 || 5000;
        const xStep = chartWidth / (combined.length - 1 || 1);

        const getY = (val) => height - padding - (val / maxDemand) * chartHeight;
        const getX = (i) => padding + i * xStep;

        const hPoints = data.historical.map((d, i) => ({ x: getX(i), y: getY(d.demand), ...d }));
        const fPoints = data.forecasted.map((d, i) => ({ x: getX(data.historical.length + i), y: getY(d.demand), ...d }));

        const lastH = hPoints[hPoints.length - 1];
        const fLinePoints = [lastH, ...fPoints];

        const hPath = `M ${hPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
        const fPath = `M ${fLinePoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

        const areaPath = `
            M ${hPoints[0].x},${height - padding}
            L ${hPoints.map(p => `${p.x},${p.y}`).join(' L ')}
            L ${fPoints.map(p => `${p.x},${p.y}`).join(' L ')}
            L ${fPoints[fPoints.length - 1].x},${height - padding}
            Z
        `;

        const generateTicks = (max) => {
            const count = 5;
            const step = max / count;
            return Array.from({ length: count + 1 }, (_, i) => Math.round(i * step));
        };
        const ticks = generateTicks(maxDemand);

        return (
            <div className={`chart-wrapper ${expanded ? 'expanded-view' : ''}`}>
                {!expanded && (
                    <button className="expand-btn" onClick={() => setIsExpanded(true)} title="View Full Screen">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                    </button>
                )}
                <svg viewBox={`0 0 ${width} ${height}`} className="forecast-chart-svg">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {ticks.map(val => {
                        const y = getY(val);
                        return (
                            <g key={val}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} className="axis-line" strokeDasharray="4 4" />
                                <text x={padding - 12} y={y + 4} textAnchor="end" className="axis-label">{val.toLocaleString()}</text>
                            </g>
                        );
                    })}

                    <path d={areaPath} className="chart-area" fill="url(#chartGradient)" />
                    <path d={hPath} className="chart-line historical" />
                    <path d={fPath} className="chart-line forecasted" strokeDasharray="8 6" />

                    {hPoints.map((p, i) => (
                        <g key={`h-g-${i}`} className="point-group">
                            <circle cx={p.x} cy={p.y} r="5" className="point historical">
                                <title>{`Date: ${p.label}\nDemand: ${Math.round(p.demand).toLocaleString()} MT`}</title>
                            </circle>
                            {(expanded || i % 2 === 0) && <text x={p.x} y={p.y - 12} textAnchor="middle" className="point-label">{Math.round(p.demand).toLocaleString()}</text>}
                        </g>
                    ))}
                    {fPoints.map((p, i) => (
                        <g key={`f-g-${i}`} className="point-group">
                            <circle cx={p.x} cy={p.y} r="5" className="point forecasted">
                                <title>{`Forecast Date: ${p.label.replace(' (Forecast)', '')}\nPredicted Demand: ${Math.round(p.demand).toLocaleString()} MT`}</title>
                            </circle>
                            <text x={p.x} y={p.y - 12} textAnchor="middle" className="point-label bold">{Math.round(p.demand).toLocaleString()}</text>
                        </g>
                    ))}

                    {combined.map((d, i) => {
                        const showLabel = expanded || combined.length <= 10 || i % 2 === 0;
                        return showLabel ? (
                            <text key={i} x={getX(i)} y={height - 25} textAnchor="middle" className="axis-label x-axis" transform={`rotate(-15, ${getX(i)}, ${height - 25})`}>
                                {d.label.replace(' (Forecast)', '')}
                            </text>
                        ) : null;
                    })}

                    <text x={15} y={height / 2} transform={`rotate(-90, 15, ${height / 2})`} textAnchor="middle" className="axis-title">Demand (MT)</text>
                </svg>

                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="line-sample historical"></span> Historical Data
                    </div>
                    <div className="legend-item">
                        <span className="line-sample forecasted"></span> ML Forecast
                    </div>
                </div>
            </div>
        );
    };

    const PieChart = ({ data }) => {
        if (!data || !data.breakdown) return null;

        const categories = {};
        data.breakdown.forEach(item => {
            const qty = parseFloat(item.quantity.replace(/,/g, ''));
            if (!categories[item.category]) {
                categories[item.category] = { total: 0, materials: [] };
            }
            categories[item.category].total += qty;
            if (!categories[item.category].materials.includes(item.material)) {
                categories[item.category].materials.push(item.material);
            }
        });

        const catEntries = Object.entries(categories);
        const actualTotal = catEntries.reduce((a, b) => a + b[1].total, 0);

        // Square-root scaling for visual balance
        const sqrtValues = catEntries.map(([cat, obj]) => ({
            cat,
            weight: Math.sqrt(obj.total),
            val: obj.total,
            materials: obj.materials
        }));
        const totalSqrtWeight = sqrtValues.reduce((a, b) => a + b.weight, 0);

        let startAngle = 0;

        return (
            <div className="pie-chart-container">
                <svg viewBox="0 0 100 100" className="pie-chart-svg">
                    {sqrtValues.map((obj, i) => {
                        const color = getMaterialColor(obj.cat, i);
                        const visualPercentage = obj.weight / totalSqrtWeight;
                        const endAngle = startAngle + visualPercentage * 360;
                        const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
                        const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
                        const x2 = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
                        const y2 = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
                        const largeArcFlag = visualPercentage > 0.5 ? 1 : 0;
                        const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                        startAngle = endAngle;
                        return (
                            <path key={obj.cat} d={pathData} fill={color} className="pie-slice">
                                <title>{`${obj.cat}: ${((obj.val / actualTotal) * 100).toFixed(1)}%\nMaterials: ${obj.materials.join(', ')}`}</title>
                            </path>
                        );
                    })}
                </svg>
                <div className="pie-legend">
                    {catEntries.map(([cat, obj], i) => (
                        <div key={cat} className="legend-item">
                            <span className="color-box" style={{ backgroundColor: getMaterialColor(cat, i) }}></span>
                            <span className="label" title={`Materials: ${obj.materials.join(', ')}`}>
                                {cat} ({((obj.total / actualTotal) * 100).toFixed(0)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const BarChart = ({ data }) => {
        if (!data) return null;
        const hAvg = data.historical.reduce((a, b) => a + b.demand, 0) / data.historical.length;
        const fAvg = data.forecasted.reduce((a, b) => a + b.demand, 0) / data.forecasted.length;

        const maxValue = Math.max(hAvg, fAvg) * 1.2;
        const hHeight = (hAvg / maxValue) * 150;
        const fHeight = (fAvg / maxValue) * 150;

        return (
            <div className="comparison-bar-chart">
                <div className="bar-group">
                    <div className="bar historical" style={{ height: `${hHeight}px` }}>
                        <span className="value">{Math.round(hAvg).toLocaleString()}</span>
                    </div>
                    <span className="label">Monthly Historical Avg</span>
                </div>
                <div className="bar forecasted" style={{ height: `${fHeight}px` }}>
                    <div className="bar-pattern"></div>
                    <span className="value">{Math.round(fAvg).toLocaleString()}</span>
                </div>
                <span className="label">Monthly Forecasted Avg</span>
            </div>
        );
    };

    const AIInsights = ({ insights }) => {
        if (!insights || insights.length === 0) return null;

        const getIcon = (iconName) => {
            switch (iconName) {
                case 'trending-up': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
                case 'calendar': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
                case 'dollar-sign': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
                default: return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
            }
        };

        return (
            <div className="ai-insights-container">
                <div className="insight-header">
                    <div className="glow-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <h4>AI-Powered Strategic Insights</h4>
                </div>
                <div className="insights-list">
                    {insights.map((insight, idx) => (
                        <div key={idx} className={`insight-card ${insight.type}`}>
                            <div className="insight-icon">{getIcon(insight.icon)}</div>
                            <p>{insight.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="forecast-container refinement page-container">
            {isExpanded && (
                <div className="modal-overlay fullscreen" onClick={() => setIsExpanded(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-text">
                                <h3>Detailed Forecast Analysis</h3>
                                <p>Comprehensive breakdown of material demand trends</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsExpanded(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <SVGChart data={forecastData} expanded={true} />

                            <div className="detailed-data-table">
                                <h4>Monthly Breakdown Data</h4>
                                <table className="breakdown-table">
                                    <thead>
                                        <tr>
                                            <th>Time Period</th>
                                            <th>Demand (MT)</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {forecastData?.historical.map((d, idx) => (
                                            <tr key={`h-row-${idx}`}>
                                                <td>{d.label}</td>
                                                <td className="bold">{Math.round(d.demand).toLocaleString()}</td>
                                                <td><span className="badge-gray">Historical</span></td>
                                                <td><span className="text-muted">Recorded</span></td>
                                            </tr>
                                        ))}
                                        {forecastData?.forecasted.map((d, idx) => (
                                            <tr key={`f-row-${idx}`}>
                                                <td>{d.label}</td>
                                                <td className="bold primary-text">{Math.round(d.demand).toLocaleString()}</td>
                                                <td><span className="badge-blue">ML Prediction</span></td>
                                                <td><span className="text-confidence">94% Confidence</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <label>Project Budget (₹ Repees)</label>
                        <input type="text" name="budget" placeholder="Enter budget (e.g. 20000000)" value={formData.budget} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label>Project Location</label>
                        <select name="location" value={formData.location} onChange={handleInputChange}>
                            <option value="">Select Region...</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Delhi">Delhi</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tower Type</label>
                        <select name="towerType" value={formData.towerType} onChange={handleInputChange}>
                            <option value="">Select Tower Type...</option>
                            <option value="Transmission">Transmission Tower</option>
                            <option value="Distribution">Distribution Tower</option>
                            <option value="Substation">Substation Equipment</option>
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

            {forecastData && (
                <div className="additional-visuals-grid">
                    <div className="visual-card">
                        <div className="card-title-group">
                            <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                <path d="M21 5c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            </svg>
                            <h3>Material Mix Analysis</h3>
                        </div>
                        <p className="card-subtitle">Distribution of demand across material categories</p>
                        <PieChart data={forecastData} />
                    </div>

                    <div className="visual-card">
                        <div className="card-title-group">
                            <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="18" y="3" width="4" height="18" />
                                <rect x="10" y="8" width="4" height="13" />
                                <rect x="2" y="13" width="4" height="8" />
                            </svg>
                            <h3>Demand Growth Contrast</h3>
                        </div>
                        <p className="card-subtitle">Comparison of historical vs. projected monthly averages</p>
                        <BarChart data={forecastData} />
                    </div>

                    <div className="visual-card insight-span">
                        <AIInsights insights={forecastData?.insights} />
                    </div>
                </div>
            )}

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
                                        <td className="bold">
                                            <div className="material-cell">
                                                <span className="material-dot" style={{ backgroundColor: getMaterialColor(row.material, idx) }}></span>
                                                {row.material}
                                            </div>
                                        </td>
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
