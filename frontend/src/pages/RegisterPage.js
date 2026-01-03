import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { mockRegister } from "../services/mockAuth";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    /*const register = async () => {
        try {
            await API.post("/auth/register", form);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed");
        }
    };*/


    const register = async () => {
        await mockRegister(form);
        alert("Registered successfully");
        navigate("/login");
    };


    return (
        <div>
            <h2>Register</h2>

            <input placeholder="Username"
                onChange={e => setForm({ ...form, username: e.target.value })} />

            <input placeholder="Email"
                onChange={e => setForm({ ...form, email: e.target.value })} />

            <input type="password" placeholder="Password"
                onChange={e => setForm({ ...form, password: e.target.value })} />

            <button onClick={register}>Register</button>
            <p>
                Already have an account? <button onClick={() => navigate("/login")}>Login</button>
            </p>
        </div>
    );
}
