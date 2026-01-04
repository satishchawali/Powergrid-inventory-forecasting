import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import API from "../services/api";
import { mockRegister } from "../../services/mockAuth";
import logo from "../../logo.png";
import "./RegisterPage.css";   // reuse login CSS

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    // Mock version
    const register = async () => {
        if (!form.username || !form.email || !form.password) {
            alert("Please fill all fields");
            return;
        }

        await mockRegister(form);
        alert("Registered successfully 🎉");
        navigate("/login");
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <img src={logo} alt="Logo" className="card-logo" />
                <h2>Create Account</h2>
                <p className="subtitle">Register to get started</p>

                <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button className="register-btn" onClick={register}>
                    Register
                </button>

                <p className="register-text">
                    Already have an account?
                    <span onClick={() => navigate("/login")}> Login</span>
                </p>
            </div>
        </div>
    );
}
