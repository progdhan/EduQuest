import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbPromise, STORE_USERS } from "../App";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const db = await dbPromise;
            const user = await db.get(STORE_USERS, username.trim());

            if (!user) {
                setError("User not found. Try student1, student2, or teacher");
                setLoading(false);
                return;
            }

            setTimeout(() => {
                setLoading(false);
                localStorage.setItem("eduquest-user", JSON.stringify(user));
                if (user.role === "teacher") navigate("/teacher");
                else navigate("/student");
            }, 800);
        } catch (err) {
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    }

    // Styles
    const backgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1f1f2e, #3a3a5a)", // Dark gradient
        overflow: "hidden",
        zIndex: -1,
    };

    const shapeStyle = (size, top, left, delay, color) => ({
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        top: top,
        left: left,
        animation: `floatShape 6s ease-in-out ${delay}s infinite alternate`,
        opacity: 0.4,
    });

    const formStyle = {
        display: mounted ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        animation: mounted ? "fadeInUp 0.8s ease-out forwards" : "none",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        background: "rgba(30, 30, 50, 0.45)", // glassmorphism
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1.5px solid rgba(255,255,255,0.15)",
        padding: "48px 36px 36px 36px",
        borderRadius: "28px",
        boxShadow: "0 24px 48px rgba(30,30,50,0.35)",
        width: "95%",
        maxWidth: "410px",
        boxSizing: "border-box",
        textAlign: "center",
        position: "relative",
    };

    const inputContainer = {
        position: "relative",
        marginBottom: "25px",
        width: "100%",
    };

    const inputStyle = {
        width: "100%",
        padding: "16px 50px 16px 40px",
        fontSize: "16px",
        borderRadius: "50px",
        border: "2px solid #555",
        outline: "none",
        background: "rgba(40,40,60,0.85)",
        color: "white",
        boxSizing: "border-box",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
    };

    const iconStyle = {
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "18px",
        color: "#aaa",
        transition: "all 0.3s ease",
    };

    const labelStyle = {
        position: "absolute",
        left: "40px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "16px",
        color: "#aaa",
        pointerEvents: "none",
        transition: "all 0.3s ease",
    };

    const buttonStyle = {
        width: "100%",
        padding: "16px",
        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontWeight: "600",
        fontSize: "16px",
        borderRadius: "50px",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: !username.trim() || !password || loading ? 0.7 : 1,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        boxShadow: "0 10px 24px rgba(102,126,234,0.25)",
        position: "relative",
        overflow: "hidden",
        letterSpacing: "0.5px",
    };

    const errorStyle = {
        color: "#e74c3c",
        fontSize: "14px",
        fontWeight: "500",
        marginTop: "10px",
        opacity: error ? 1 : 0,
        transition: "opacity 0.3s ease",
    };

    return (
        <>
            {/* Animated Background */}
            <div style={backgroundStyle}>
                <div style={shapeStyle("80px", "10%", "20%", 0, "#667eea")} />
                <div style={shapeStyle("120px", "70%", "10%", 2, "#764ba2")} />
                <div style={shapeStyle("60px", "50%", "80%", 1, "#f093fb")} />
                <div style={shapeStyle("100px", "30%", "60%", 3, "#f5576c")} />
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {opacity:0; transform:translateY(30px);}
                    to {opacity:1; transform:translateY(0);}
                }
                @keyframes floatShape {
                    0% {transform: translateY(0) scale(1);}
                    30% {transform: translateY(-30px) scale(1.05);}
                    60% {transform: translateY(10px) scale(0.98);}
                    100% {transform: translateY(0) scale(1);}
                }
                input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px #667eea44;
                }
                button:hover:not(:disabled) {
                    background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
                    box-shadow: 0 12px 32px rgba(102,126,234,0.32);
                }
                button:active:not(:disabled) {
                    background: linear-gradient(90deg, #667eea 0%, #f093fb 100%);
                }
                /* Responsive adjustments */
                @media (max-width: 500px) {
                    input {
                        font-size: 14px;
                        padding: 14px 45px 14px 35px;
                    }
                    button {
                        font-size: 14px;
                        padding: 14px;
                    }
                    .vectus-logo {
                        width: 48px !important;
                        height: 48px !important;
                    }
                }
            `}</style>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    fontFamily: "Segoe UI, sans-serif",
                    padding: "20px",
                    zIndex: 1,
                }}
            >
                <form style={formStyle} onSubmit={handleLogin}>
                    {/* Logo/Icon */}
                    <div style={{ marginBottom: "18px" }}>
                        <svg className="vectus-logo" width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ display: "inline-block" }}>
                            <circle cx="28" cy="28" r="28" fill="#667eea" />
                            <path d="M16 36L28 16L40 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 style={{ marginBottom: "30px", color: "#fff", fontWeight: 400, letterSpacing: "1px" }}>
                        Vectus Login
                    </h2>

                    {/* Username */}
                    <div style={inputContainer}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            disabled={loading}
                        />
                        <span style={iconStyle}>👤</span>
                        <label
                            style={{
                                ...labelStyle,
                                top: username ? "-8px" : "50%",
                                fontSize: username ? "12px" : "16px",
                                color: username ? "#667eea" : "#aaa",
                            }}
                        >
                            Username
                        </label>
                    </div>

                    {/* Password */}
                    <div style={inputContainer}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            disabled={loading}
                        />
                        <span style={iconStyle}>🔒</span>
                        <label
                            style={{
                                ...labelStyle,
                                top: password ? "-8px" : "50%",
                                fontSize: password ? "12px" : "16px",
                                color: password ? "#667eea" : "#aaa",
                            }}
                        >
                            Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!username || !password || loading}
                        style={buttonStyle}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p style={errorStyle}>{error}</p>}

                    <p style={{ marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
                        For demo use: <br />
                        <strong>student1</strong>, <strong>student2</strong>, or{" "}
                        <strong>teacher</strong> <br />
                        Password can be anything
                    </p>
                </form>
            </div>
        </>
    );
}
