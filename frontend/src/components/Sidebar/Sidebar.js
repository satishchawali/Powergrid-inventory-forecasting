import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/logo.png"; // adjust path if needed

function Sidebar() {
    return (
        <div className="sidebar">
            {/* HEADER */}
            <div className="sidebar-header">
                <div className="logo">
                    <img src={logo} alt="Powergrid logo" />
                </div>
                <div>
                    <h3>POWERGRID</h3>
                    <p>Forecasting System</p>
                </div>
            </div>

            {/* MENU */}
            <nav className="sidebar-menu">
                <NavLink to="/dashboard" className="menu-item">
                    <span>📊</span> Dashboard
                </NavLink>

                <NavLink to="/forecast" className="menu-item">
                    <span>🔮</span> Forecast
                </NavLink>

                <NavLink to="/materials" className="menu-item">
                    <span>🧱</span> Materials
                </NavLink>

                <NavLink to="/reports" className="menu-item">
                    <span>📑</span> Reports
                </NavLink>
            </nav>

            {/* USER PROFILE (BOTTOM) */}
            <div className="sidebar-profile">
                <div className="profile-img">
                    <img src={`https://ui-avatars.com/api/?name=${localStorage.getItem("username") || "User"}&background=random`} alt="User" />
                </div>
                <div className="profile-info">
                    <h4>{localStorage.getItem("username") || "User"}</h4>
                    <p>{localStorage.getItem("email") || "user@powergrid.in"}</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
