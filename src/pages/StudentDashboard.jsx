import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbPromise, STORE_PROGRESS } from "../App";

const subjects = [
    { name: "Science", icon: "🔬" },
    { name: "Technology", icon: "💻" },
    { name: "Engineering", icon: "🔧" },
    { name: "Mathematics", icon: "📐" },
];

function getLevel(xp) {
    let level = 1;
    let threshold = 50;
    let remainingXP = xp;

    while (remainingXP >= threshold) {
        level++;
        remainingXP -= threshold;
        threshold = Math.floor(threshold * 1.5);
    }

    return { level, xpIn: remainingXP, xpNext: threshold };
}

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [grade, setGrade] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [progress, setProgress] = useState({ xp: 0, completedLessons: [] });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("eduquest-user"));
        if (!userData || userData.role !== "student") {
            navigate("/login");
            return;
        }
        setUser(userData);
        setGrade(userData.grade);

        async function loadProgress() {
            try {
                const db = await dbPromise;
                if (!db) return; // safety check
                const data = await db.get(STORE_PROGRESS, userData.username);
                if (data) {
                    setProgress(data);
                } else {
                    setProgress({ xp: 0, completedLessons: [] });
                }
            } catch (err) {
                console.error("Failed to load progress:", err);
                setProgress({ xp: 0, completedLessons: [] });
            }
        }
        loadProgress();

        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, [navigate]);

    if (!user) return null;

    const { level, xpIn, xpNext } = getLevel(progress.xp);
    const xpPercent = Math.floor((xpIn / xpNext) * 100);

    const handleSubjectClick = (subject) => {
        if (subject === "Science") setSelectedSubject(subject);
        else alert("Only Science subject available in MVP");
    };

    const modules = selectedSubject === "Science" ? [{ name: "Biology", icon: "🧬" }] : [];

    // Styles
    const backgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1f1f2e, #3a3a5a)",
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

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        padding: "20px",
        zIndex: 1,
    };

    const cardStyle = {
        display: mounted ? "block" : "none",
        animation: mounted ? "fadeInUp 0.8s ease-out forwards" : "none",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        background: "rgba(30,30,50,0.45)", // glassmorphism
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1.5px solid rgba(255,255,255,0.15)",
        padding: "56px 32px 40px 32px",
        borderRadius: "28px",
        boxShadow: "0 24px 48px rgba(30,30,50,0.35)",
        width: "100%",
        maxWidth: "510px",
        boxSizing: "border-box",
        textAlign: "center",
        position: "relative",
        color: "#fff",
    };

    const titleStyle = {
        marginBottom: 10,
        fontWeight: "300",
        fontSize: "2.2rem",
        letterSpacing: "1px",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease 0.2s",
    };

    const subtitleStyle = {
        marginBottom: 30,
        fontWeight: "600",
        fontSize: "1.4rem",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
    };

    const listStyle = {
        listStyleType: "none",
        padding: 0,
        marginBottom: 30,
        display: "flex",
        justifyContent: "center",
        gap: 15,
        flexWrap: "wrap",
    };

    const listItemStyle = {
        margin: 0,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease 0.4s",
    };

    const buttonStyle = {
        padding: "10px 22px",
        fontSize: "1rem",
        borderRadius: "50px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minWidth: 120,
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(102,126,234,0.10)",
        letterSpacing: "0.5px",
    };

    const backButtonStyle = {
        ...buttonStyle,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
    };

    const logoutButtonStyle = {
        ...buttonStyle,
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "#fff",
    };

    const buttonContainerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginTop: 20,
    };

    if (selectedSubject && modules.length > 0) {
        return (
            <>
                <div style={backgroundStyle}>
                    <div style={shapeStyle("80px", "10%", "20%", 0, "#667eea")} />
                    <div style={shapeStyle("120px", "70%", "10%", 2, "#764ba2")} />
                    <div style={shapeStyle("60px", "50%", "80%", 1, "#f093fb")} />
                    <div style={shapeStyle("100px", "30%", "60%", 3, "#f5576c")} />
                </div>

                <style>{`
          @keyframes fadeInUp { from {opacity:0; transform:translateY(30px);} to {opacity:1; transform:translateY(0);} }
          @keyframes floatShape { 0% {transform: translateY(0);} 50% {transform: translateY(-20px);} 100% {transform: translateY(0);} }
          @keyframes progressFill { from {width:0%;} }
        `}</style>

                <div style={containerStyle}>
                    <div style={cardStyle}>
                        <h2 style={titleStyle}>Welcome, {user.username}</h2>
                        <LevelXPDisplay level={level} xp={progress.xp} xpIn={xpIn} xpNext={xpNext} xpPercent={xpPercent} mounted={mounted} />
                        <h3 style={subtitleStyle}>Grade {grade} - {selectedSubject}</h3>
                        <h4 style={{ ...subtitleStyle, fontSize: "1.2rem", marginBottom: 20 }}>Modules</h4>
                        <ul style={listStyle}>
                            {modules.map((m, index) => (
                                <li key={m.name} style={{ ...listItemStyle, transitionDelay: `${0.5 + index * 0.1}s` }}>
                                    <button
                                        style={buttonStyle}
                                        onClick={() => navigate("/lesson", { state: { subject: selectedSubject, module: m.name } })}
                                    >
                                        {m.icon} {m.name}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div style={buttonContainerStyle}>
                            <button style={backButtonStyle} onClick={() => setSelectedSubject(null)}>
                                ← Back to Subjects
                            </button>
                            <button style={logoutButtonStyle} onClick={() => { localStorage.removeItem("eduquest-user"); navigate("/login"); }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={backgroundStyle}>
                <div style={shapeStyle("80px", "10%", "20%", 0, "#667eea")} />
                <div style={shapeStyle("120px", "70%", "10%", 2, "#764ba2")} />
                <div style={shapeStyle("60px", "50%", "80%", 1, "#f093fb")} />
                <div style={shapeStyle("100px", "30%", "60%", 3, "#f5576c")} />
            </div>

            <style>{`
                @keyframes fadeInUp { from {opacity:0; transform:translateY(30px);} to {opacity:1; transform:translateY(0);} }
                @keyframes floatShape { 0% {transform: translateY(0);} 50% {transform: translateY(-20px);} 100% {transform: translateY(0);} }
                .dashboard-card button:hover:not(:disabled) {
                    filter: brightness(1.08);
                    box-shadow: 0 8px 24px rgba(102,126,234,0.18);
                }
                .dashboard-card button:active:not(:disabled) {
                    filter: brightness(0.95);
                }
                @media (max-width: 600px) {
                    .dashboard-card {
                        padding: 16px 4vw 24px 4vw !important;
                        border-radius: 18px !important;
                        max-width: 98vw !important;
                    }
                    .dashboard-card h2 {
                        font-size: 1.4rem !important;
                    }
                }
            `}</style>

            <div style={containerStyle}>
                <div style={cardStyle} className="dashboard-card">
                    <h2 style={titleStyle}>Welcome, {user.username}</h2>
                    <LevelXPDisplay level={level} xp={progress.xp} xpIn={xpIn} xpNext={xpNext} xpPercent={xpPercent} mounted={mounted} />
                    <h3 style={subtitleStyle}>Select Subject</h3>
                    <ul style={listStyle}>
                        {subjects.map((s, index) => (
                            <li key={s.name} style={{ ...listItemStyle, transitionDelay: `${0.5 + index * 0.1}s` }}>
                                <button
                                    style={s.name !== "Science" ? { ...buttonStyle, opacity: 0.6, cursor: "not-allowed" } : buttonStyle}
                                    onClick={() => handleSubjectClick(s.name)}
                                    disabled={s.name !== "Science"}
                                >
                                    {s.icon} {s.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div style={buttonContainerStyle}>
                        <button style={logoutButtonStyle} onClick={() => { localStorage.removeItem("eduquest-user"); navigate("/login"); }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function LevelXPDisplay({ level, xp, xpIn, xpNext, xpPercent, mounted }) {
    return (
        <div style={{ marginBottom: 30, textAlign: "center", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease 0.3s" }}>
            <h4 style={{ marginBottom: 12, fontSize: "1.3rem", color: "#fff", fontWeight: "500", letterSpacing: "0.5px" }}>
                Level {level} &nbsp;|&nbsp; Total XP: {xp}
            </h4>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, height: 12, width: "80%", margin: "0 auto", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${xpPercent}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 10, transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <small style={{ color: "#ccc", fontSize: "0.9rem", display: "block", marginTop: 8 }}>
                {xpIn} XP / {xpNext} XP to next level ({xpPercent}%)
            </small>
        </div>
    );
}
