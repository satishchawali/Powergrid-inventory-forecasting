import React from "react";
import "./Header.css";
import logo from "../../logo.png";
// path to your logo

export default function Header() {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Website Logo" className="logo" />
                <h1 className="site-name">PowerGrid Forecast</h1>
            </div>
        </header>
    );
}
