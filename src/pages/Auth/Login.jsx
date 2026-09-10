
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../assets/login.css";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(email, password);

            console.log("LOGIN RESPONSE:", data);

            // Save logged-in user
            localStorage.setItem("user", JSON.stringify(data));

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.log("LOGIN ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.code === "ERR_NETWORK") {
                setError("Unable to connect to server.");
            } else {
                setError("Login failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                <h2>School Management System</h2>

                <p className="login-subtitle">
                    Login to your account
                </p>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    {/* Email */}
                    <div className="login-form-group">

                        <label>Email</label>

                        <input
                            // type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />

                    </div>


                    {/* Password */}
                    <div className="login-form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;
