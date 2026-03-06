import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

import { IoFlash } from "react-icons/io5";
import api from "../api/api";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

      const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        if (!email || !password) {
            return Swal.fire({
                icon: "warning",
                title: "Missing data",
                text: "Email and password are required",
            });
        }

        setLoading(true);

        Swal.fire({
            title: "Signing in...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const res = await api.post('/auth/login', {
                email,
                password,
            });

            const user = res.data?.user;
            console.log(res)

            localStorage.setItem("user", JSON.stringify(user));

            window.location.href = "/";
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: err.response?.data?.message || 'Login error',
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="header-logo">
                    <IoFlash size={36} className="logo-icon"/>
                    <span className="logo-text">Team Leave Login</span>
                </div>
                <p className="auth-subtitle">Welcome to team leave management</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" required />

                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <button className="btn-primary" disabled={loading}>
                        {loading ? <FiLoader className="spin" /> : "Login"}
                    </button>
                </form>

            
                <p className="auth-footer">
                    Don’t have an account? <Link to="/login">Register...</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;