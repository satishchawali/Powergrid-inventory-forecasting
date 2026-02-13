import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();
    const currentDate = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });


    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="top-header">
            <div className="header-title">
                <h2>Material Demand Forecasting</h2>
            </div>

            <div className="header-actions">
                <div className="last-updated">
                    {/* <span className="clock-icon">🕒</span> */}
                    <span><b>Last Login:</b> {currentDate}</span>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    {/* <span className="logout-icon">↪️</span> */}
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
