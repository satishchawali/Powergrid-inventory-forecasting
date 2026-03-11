import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png"
import "./LoginPage.css";
import { loginUser } from "../../services/api";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    useEffect(() => {
        document.title = "Login - Forcastify";
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Please fill all fields");
            return;
        }

        setIsLoading(true);
        try {
            const res = await loginUser(username, password);
            login(res);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
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
                            handleLogin(); // submit on Enter
                        }
                    }}
                />

                <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                <p className="register-text">
                    Don’t have an account?
                    <span onClick={() => navigate("/register")}> Register</span>
                </p>
            </div>
        </div>
    );
}
