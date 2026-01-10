import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.png";
import "./RegisterPage.css";
import { registerUser } from "../../services/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        full_name: "",
        password: ""
    });

    const usernameRef = useRef(null);
    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const register = async () => {
        if (!form.username || !form.email || !form.password || !form.full_name) {
            alert("Please fill all fields");
            return;
        }

        try {
            await registerUser(form);
            alert("Registered successfully 🎉");
            navigate("/login");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <img src={logo} alt="Logo" className="card-logo" />
                <h2>Create Account</h2>
                <p className="subtitle">Register to get started</p>

                <input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    autoComplete="off"
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            fullNameRef.current.focus();
                        }
                    }}
                />

                <input
                    ref={fullNameRef}
                    type="text"
                    placeholder="Full Name"
                    value={form.full_name}
                    autoComplete="off"
                    onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            emailRef.current.focus();
                        }
                    }}
                />

                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    autoComplete="off"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
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
                    value={form.password}
                    autoComplete="new-password"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            register();
                        }
                    }}
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
