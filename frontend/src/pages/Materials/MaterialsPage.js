import React, { useState, useEffect } from "react";
import { getInventory } from "../../services/api";
import "./MaterialsPage.css";

export default function MaterialsPage() {
    const [inventory, setInventory] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Materials Inventory - Forecasting System";
        loadInventory();
    }, []);

    useEffect(() => {
        const filtered = inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchTerm, inventory]);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await getInventory();
            setInventory(data);
            setFilteredItems(data);
        } catch (err) {
            setError("Failed to load inventory data from server.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="materials-container loading">
                <div className="loader"></div>
                <p>Syncing with inventory database...</p>
            </div>
        );
    }

    return (
        <div className="materials-container">
            <div className="materials-header">
                <div>
                    <h1>Materials Inventory</h1>
                    <p className="subtitle">Real-time tracking of substation materials and power grid assets</p>
                </div>
                <button className="refresh-btn" onClick={loadInventory}>
                    <span>🔄</span> Refresh
                </button>
            </div>

            <div className="inventory-controls">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
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
                        <span className="value">{inventory.length}</span>
                    </div>
                    <div className="mini-stat">
                        <span className="label">Low Stock</span>
                        <span className="value critical">{inventory.filter(i => i.status === "Low Stock").length}</span>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="error-card">
                    <div className="error-icon">⚠️</div>
                    <h3>Connection Error</h3>
                    <p>{error}</p>
                    <button onClick={loadInventory}>Try Again</button>
                </div>
            ) : (
                <div className="materials-table-wrapper">
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
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.item_id}>
                                        <td className="item-name">{item.name}</td>
                                        <td><span className="category-tag">{item.category}</span></td>
                                        <td className="stock-level">
                                            <span className={item.quantity < item.threshold ? "text-danger" : ""}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td>{item.unit}</td>
                                        <td>{item.threshold}</td>
                                        <td>
                                            <span className={`status-badge ${item.status === "Low Stock" ? "low" : "ok"}`}>
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
            )}
        </div>
    );
}
