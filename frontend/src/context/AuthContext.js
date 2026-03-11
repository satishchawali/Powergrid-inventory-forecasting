import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const username = localStorage.getItem("username");
        if (token && username) {
            setUser({ username, token });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem("access_token", userData.access_token);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("email", userData.email || "");
        localStorage.setItem("full_name", userData.full_name || "");
        setUser({ username: userData.username, token: userData.access_token });
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("full_name");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
