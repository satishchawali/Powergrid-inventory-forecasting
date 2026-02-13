import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import "./LoginPage.css";
import { loginUser } from "../../services/api";
import { useEffect } from "react";

export default function LoginPage() {
    useEffect(() => {
        document.title = "Login - Forcastify";
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const login = async () => {
        if (!username || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await loginUser(username, password);
            localStorage.setItem("token", res.access_token);
            localStorage.setItem("username", res.username);
            localStorage.setItem("email", res.email);
            localStorage.setItem("full_name", res.full_name);
            navigate("/dashboard");
        } catch {
            alert("Login failed ❌");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} alt="Logo" className="card-logo" />
                <h2>Welcome Back</h2>
                <p className="subtitle">Login to continue</p>

                <input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    value={username}
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            passwordRef.current.focus();
                        }
                    }}
                />

                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            login(); // submit on Enter
                        }
                    }}
                />

                <button className="login-btn" onClick={login}>
                    Login
                </button>

                <p className="register-text">
                    Don’t have an account?
                    <span onClick={() => navigate("/register")}> Register</span>
                </p>
            </div>
        </div>
    );
}
