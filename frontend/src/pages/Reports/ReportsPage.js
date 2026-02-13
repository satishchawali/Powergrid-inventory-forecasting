import React, { useState, useEffect } from "react";
import { getReports, getReportTypes, generateReport, getReportStatus } from "../../services/api";
import "./ReportsPage.css";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        document.title = "Reports - Forecasting System";
        fetchData();

        // Polling for generating reports
        const interval = setInterval(() => {
            checkPendingReports();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [reportsData, typesData] = await Promise.all([
                getReports(),
                getReportTypes()
            ]);
            setReports(reportsData);
            setTypes(typesData);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkPendingReports = async () => {
        setReports(prev => {
            const pending = prev.filter(r => r.status === "Generating");
            if (pending.length === 0) return prev;

            // Just refresh all if any are pending
            getReports().then(setReports).catch(console.error);
            return prev;
        });
    };

    const handleGenerate = async (typeId) => {
        setGenerating(true);
        try {
            await generateReport(typeId);
            await fetchData();
            setShowModal(false);
        } catch (err) {
            alert("Failed to start generation");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="reports-loading">Loading Reports...</div>;

    return (
        <div className="reports-container">
            <div className="reports-header-section">
                <div>
                    <h1>Reports Center</h1>
                    <p>Manage and download system-generated inventory reports</p>
                </div>
                <button className="create-report-btn" onClick={() => setShowModal(true)}>
                    <span>+</span> Create New Report
                </button>
            </div>

            <div className="reports-list-grid">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <div key={report.id} className={`report-item-card ${report.status.toLowerCase()}`}>
                            <div className="report-main">
                                <div className="report-type-icon">
                                    {report.format === "PDF" ? "📄" : "📊"}
                                </div>
                                <div className="report-details">
                                    <h3>{report.title}</h3>
                                    <div className="report-meta">
                                        <span>{report.type}</span>
                                        <span className="dot">•</span>
                                        <span>{report.created_at}</span>
                                        <span className="dot">•</span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-actions">
                                <span className={`status-tag ${report.status.toLowerCase()}`}>
                                    {report.status === "Generating" && <span className="pulse-dot"></span>}
                                    {report.status}
                                </span>
                                {report.status === "Completed" && (
                                    <button className="report-download-link">Download {report.format}</button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reports-placeholder">
                        <div className="placeholder-icon">📋</div>
                        <h3>No Reports Generated Yet</h3>
                        <p>Click "Create New Report" to analyze your inventory data.</p>
                    </div>
                )}
            </div>

            {/* GENERATE MODAL */}
            {showModal && (
                <div className="report-modal-overlay">
                    <div className="report-modal">
                        <div className="modal-header">
                            <h2>Select Report Type</h2>
                            <button onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="types-grid">
                            {types.map(t => (
                                <div key={t.id} className="type-option" onClick={() => handleGenerate(t.id)}>
                                    <h4>{t.name}</h4>
                                    <p>{t.description}</p>
                                </div>
                            ))}
                        </div>
                        {generating && <div className="modal-loading">Starting Generation...</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
