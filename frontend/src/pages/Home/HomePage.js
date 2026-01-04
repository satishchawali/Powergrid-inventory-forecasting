import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">PowerGrid Inventory Forecasting</h1>
                <p className="home-subtitle">
                    Advanced AI-driven analytics for smarter inventory management.
                    Predict demand, optimize stock, and ensure reliability.
                </p>
                <div className="cta-group">
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/register')}>
                        Get Started
                    </button>
                </div>
            </div>
            <div className="background-overlay"></div>
        </div>
    );
};

export default HomePage;
