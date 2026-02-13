import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInventory } from "../../services/api";
import "./MaterialsPage.css";
import { Search } from "lucide-react";

export default function MaterialsPage() {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageSize] = useState(50);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Materials Inventory - Forecasting System";
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
            loadInventory(1, searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        loadInventory(page, searchTerm);
    }, [page]);

    const loadInventory = async (currentPage, search) => {
        try {
            setLoading(true);
            const response = await getInventory({
                page: currentPage,
                page_size: pageSize,
                search: search
            });
            setInventory(response.items);
            setTotalPages(Math.ceil(response.total / pageSize));
            setTotalItemsCount(response.total_all);
            setLowStockCount(response.low_stock_all);
        } catch (err) {
            setError("Failed to load inventory data from server.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    if (loading && inventory.length === 0) {
        return (
            <div className="materials-container loading">
                <div className="loader"></div>
                <p>Syncing with inventory database...</p>
            </div>
        );
    }

    return (
        <div className="materials-container page-container">
            <div className="page-header">
                <div className="header-info">
                    <button className="back-btn" onClick={() => navigate("/dashboard")}>
                        ← Back to Dashboard
                    </button>
                    <h1>Materials Inventory</h1>
                    <p className="subtitle">Real-time tracking of substation materials and power grid assets</p>
                </div>
                <div className="header-actions">
                    <button className="refresh-btn" onClick={() => loadInventory(page, searchTerm)}>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="inventory-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by material name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="inventory-stats">
                    <div className="mini-stat">
                        <span className="label">Total Items</span>
                        <span className="value">{totalItemsCount}</span>
                    </div>
                    <div className="mini-stat">
                        <span className="label">Critical Alert</span>
                        <span className="value critical">{lowStockCount}</span>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="error-card">
                    <div className="error-icon">⚠️</div>
                    <h3>Connection Error</h3>
                    <p>{error}</p>
                    <button onClick={() => loadInventory(page, searchTerm)}>Try Again</button>
                </div>
            ) : (
                <>
                    <div className="materials-table-wrapper">
                        {loading && <div className="table-loading-overlay">Updating...</div>}
                        <table className="materials-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Unit</th>
                                    <th>Min Threshold</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.length > 0 ? (
                                    inventory.map((item) => (
                                        <tr key={item.item_id}>
                                            <td className="item-name">{item.name}</td>
                                            <td><span className="category-tag">{item.category}</span></td>
                                            <td className="stock-level">
                                                <span className={item.status === "Critical" ? "text-danger" : ""}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td>{item.unit}</td>
                                            <td>{item.threshold}</td>
                                            <td>
                                                <span className={`status-badge ${item.status === "Critical" ? "low" : "ok"}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-results">
                                            No materials found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="page-btn"
                            >
                                Previous
                            </button>
                            <div className="page-info">
                                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                                <span className="item-count">({(page - 1) * pageSize + 1}-{Math.min(page * pageSize, (page - 1) * pageSize + inventory.length)} of {totalItemsCount} items)</span>
                            </div>
                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className="page-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
