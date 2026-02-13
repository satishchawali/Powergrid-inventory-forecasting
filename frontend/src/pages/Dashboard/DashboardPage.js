import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/api";
import "./DashboardPage.css";

function DashboardPage() {
    const [stats, setStats] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getDashboard();

                const statsData = [
                    { title: "Total Materials", value: data.total_materials, subtitle: "Active inventory items" },
                    { title: "Low Stock Items", value: data.low_stock_items, subtitle: "Require attention" },
                    { title: "Recent Reports", value: data.recent_reports, subtitle: "Generated this month" },
                    { title: "System Status", value: data.system_status, subtitle: "All systems operational" }
                ];

                setStats(statsData);
                setMaterials(data.materials);
                setReports(data.reports);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container loading-container">
                <div className="loader"></div>
                <h1>Loading Dashboard...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container error-container">
                <h1>Error</h1>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container page-container">
            <div className="page-header">
                <div className="header-info">
                    <h1>Dashboard Overview</h1>
                    <p className="subtitle">
                        Monitor system status and key metrics at a glance
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((s, index) => (
                    <div className="stat-card" key={index}>
                        <h4>{s.title}</h4>
                        <h2 className={s.value === "Online" ? "online" : ""}>
                            {s.value}
                        </h2>
                        <p>{s.subtitle}</p>
                    </div>
                ))}
            </div>

            <div className="lower-grid">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h3>Material Status</h3>
                            <p>Current inventory status overview</p>
                        </div>
                        <button onClick={() => navigate("/materials")}>View All</button>
                    </div>

                    {materials.map((m, index) => (
                        <div className="list-row" key={index}>
                            <div>
                                <strong>{m.name}</strong>
                                <p>{m.category}</p>
                            </div>
                            <div className="right">
                                <span className={`badge ${m.status.replace(" ", "").toLowerCase()}`}>
                                    {m.status}
                                </span>
                                <p>{m.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <h3>Recent Reports</h3>
                            <p>Latest generated reports and analytics</p>
                        </div>
                        <button onClick={() => navigate("/reports")}>View All</button>
                    </div>

                    {reports.map((r, index) => (
                        <div className="list-row" key={index}>
                            <div>
                                <strong>{r.title}</strong>
                                <p>Report</p>
                            </div>
                            <div className="right">
                                <span className={`badge ${r.status.replace(" ", "").toLowerCase()}`}>
                                    {r.status}
                                </span>
                                <p>{r.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
