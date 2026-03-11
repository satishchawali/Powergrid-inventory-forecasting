import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import "./RegisterPage.css";
import { registerUser } from "../../services/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
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

    const handleRegister = async () => {
        if (!form.username || !form.email || !form.password || !form.full_name) {
            toast.error("Please fill all fields");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser(form);
            toast.success("Account created! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
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
                            handleRegister();
                        }
                    }}
                />

                <button
                    className="register-btn"
                    onClick={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Register"}
                </button>

                <p className="register-text">
                    Already have an account?
                    <span onClick={() => navigate("/login")}> Login</span>
                </p>
            </div>
        </div>
    );
}
