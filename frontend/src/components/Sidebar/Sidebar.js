import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import logo from "../../assets/logo.png";

function Sidebar() {
    const [user, setUser] = useState({
        username: localStorage.getItem("username") || "User",
        email: localStorage.getItem("email") || "user@powergrid.in",
        full_name: localStorage.getItem("full_name") || "User",
    });

    useEffect(() => {
        const handleProfileUpdate = () => {
            setUser({
                username: localStorage.getItem("username") || "User",
                email: localStorage.getItem("email") || "user@powergrid.in",
                full_name: localStorage.getItem("full_name") || "User",
            });
        };

        window.addEventListener("profileUpdated", handleProfileUpdate);

        return () => {
            window.removeEventListener("profileUpdated", handleProfileUpdate);
        };
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <img src={logo} alt="Powergrid logo" />
                </div>
                <div>
                    <h3>POWERGRID</h3>
                    <p>Forecasting System</p>
                </div>
            </div>

            <nav className="sidebar-menu">
                <NavLink to="/dashboard" className="menu-item">📊 Dashboard</NavLink>
                <NavLink to="/forecast" className="menu-item">🔮 Forecast</NavLink>
                <NavLink to="/materials" className="menu-item">🧱 Materials</NavLink>
                <NavLink to="/reports" className="menu-item">📑 Reports</NavLink>
                <NavLink to="/settings" className="menu-item">⚙️ Settings</NavLink>
            </nav>

            <div className="sidebar-profile">
                <div className="profile-img">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`}
                        alt="User"
                    />
                </div>
                <div className="profile-info">
                    <h4>{user.full_name}</h4>
                    <p>SYSTEM ADMINISTRATOR</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
