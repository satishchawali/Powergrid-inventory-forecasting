import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import API from "../services/api";
import { mockLogin } from "../services/mockAuth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    /*const login = async () => {
        try {
            const res = await API.post("/auth/login", {
                username,
                password
            });

            localStorage.setItem("token", res.data.access_token);
            alert("Login successful");
            navigate("/forecast");
        } catch (err) {
            alert("Invalid credentials");
        }
    };*/



    const login = async () => {
        try {
            const res = await mockLogin(username, password);
            localStorage.setItem("token", res.access_token);
            navigate("/forecast");
        } catch {
            alert("Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input placeholder="Username"
                onChange={e => setUsername(e.target.value)} />

            <input type="password" placeholder="Password"
                onChange={e => setPassword(e.target.value)} />

            <button onClick={login}>Login</button>
            <p>
                Don't have an account? <button onClick={() => navigate("/register")}>Register</button>
            </p>
        </div>
    );
}
