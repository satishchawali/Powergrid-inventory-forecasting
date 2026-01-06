import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import API from "../services/api";
//import { mockLogin } from "../../services/mockAuth";
import logo from "../../logo.png";
import "./LoginPage.css";
import { loginUser } from "../../services/api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    /* Backend version (use later)
    const login = async () => {
      try {
        const res = await API.post("/auth/login", {
          username,
          password
        });
        localStorage.setItem("token", res.data.access_token);
        navigate("/forecast");
      } catch (err) {
        alert("Invalid credentials");
      }
    };
    */

    // Mock version (current)
    const login = async () => {
        if (!username || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            // const res = await mockLogin(username, password);
            const res = await loginUser(username, password);
            localStorage.setItem("token", res.access_token);
            navigate("/forecast");
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
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
