import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="scrollable-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
