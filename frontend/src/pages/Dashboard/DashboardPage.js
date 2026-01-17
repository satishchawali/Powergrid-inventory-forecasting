import { useState, useEffect } from "react";
import { getDashboard } from "../../services/api";
import "./DashboardPage.css";
import { useEffect } from "react";

function DashboardPage() {
<<<<<<< HEAD
    useEffect(() => {
        document.title = "Dashboard - Forcastify";
    }, []);
    const stats = [
        { title: "Total Materials", value: 5, subtitle: "Active inventory items" },
        { title: "Low Stock Items", value: 1, subtitle: "Require attention" },
        { title: "Recent Reports", value: 5, subtitle: "Generated this month" },
        { title: "System Status", value: "Online", subtitle: "All systems operational" }
    ];
=======
    const [stats, setStats] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
>>>>>>> origin/main

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getDashboard();

                // Map API response to the format expected by the UI
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
        <div className="dashboard-container">
            <h1>Dashboard Overview</h1>
            <p className="subtitle">
                Monitor system status and key metrics at a glance
            </p>

            {/* STAT CARDS */}
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

            {/* LOWER SECTION */}
            <div className="lower-grid">
                {/* MATERIAL STATUS */}
                <div className="card">
                    <div className="card-header">
                        <h3>Material Status</h3>
                        <button>View All</button>
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

                {/* RECENT REPORTS */}
                <div className="card">
                    <div className="card-header">
                        <h3>Recent Reports</h3>
                        <button>View All</button>
                    </div>

                    {reports.map((r, index) => (
                        <div className="list-row" key={index}>
                            <div>
                                <strong>{r.title}</strong>
                                <p>{r.date}</p>
                            </div>
                            <span className={`badge ${r.status.replace(" ", "").toLowerCase()}`}>
                                {r.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
