import "./DashboardPage.css";

function DashboardPage() {
    const stats = [
        { title: "Total Materials", value: 5, subtitle: "Active inventory items" },
        { title: "Low Stock Items", value: 1, subtitle: "Require attention" },
        { title: "Recent Reports", value: 5, subtitle: "Generated this month" },
        { title: "System Status", value: "Online", subtitle: "All systems operational" }
    ];

    const materials = [
        {
            name: "Galvanized Steel Towers",
            category: "Tower Components",
            quantity: "245 Units",
            status: "In Stock"
        },
        {
            name: "ACSR Conductor Cable",
            category: "Transmission Line",
            quantity: "12.5 Kilometers",
            status: "Low Stock"
        },
        {
            name: "Porcelain Insulators",
            category: "Sub-station Fittings",
            quantity: "1250 Units",
            status: "In Stock"
        }
    ];

    const reports = [
        {
            title: "Q4 2024 Material Demand Forecast",
            status: "Completed",
            date: "2024-01-15"
        },
        {
            title: "Current Inventory Status Report",
            status: "Completed",
            date: "2024-01-16"
        },
        {
            title: "Material Usage Analysis - 2024",
            status: "In Progress",
            date: "2024-01-14"
        }
    ];

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
