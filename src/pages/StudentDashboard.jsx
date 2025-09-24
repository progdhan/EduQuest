import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbPromise, STORE_PROGRESS } from '../App' // Adjust path if needed

const subjects = [
    { name: 'Science', icon: '🔬' },
    { name: 'Technology', icon: '💻' },
    { name: 'Engineering', icon: '🔧' },
    { name: 'Mathematics', icon: '📐' }
]

function getLevel(xp) {
    let level = 1
    let threshold = 50
    let remainingXP = xp

    while (remainingXP >= threshold) {
        level++
        remainingXP -= threshold
        threshold = Math.floor(threshold * 1.5)
    }

    return { level, xpIn: remainingXP, xpNext: threshold }
}

export default function StudentDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [grade, setGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [progress, setProgress] = useState({ xp: 0, completedLessons: [] })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'student') {
            navigate('/login')
            return
        }
        setUser(userData)
        setGrade(userData.grade)

        async function loadProgress() {
            try {
                const db = await dbPromise
                const data = await db.get(STORE_PROGRESS, userData.username)
                if (data) {
                    setProgress(data)
                } else {
                    setProgress({ xp: 0, completedLessons: [] })
                }
            } catch (err) {
                console.error('Failed to load progress:', err)
                setProgress({ xp: 0, completedLessons: [] })
            }
        }
        loadProgress()

        // Trigger entrance animation
        const timer = setTimeout(() => setMounted(true), 100)
        return () => clearTimeout(timer)
    }, [navigate])

    if (!user) return null

    const { level, xpIn, xpNext } = getLevel(progress.xp)
    const xpPercent = Math.floor((xpIn / xpNext) * 100)

    const handleSubjectClick = subject => {
        if (subject === 'Science') {
            setSelectedSubject(subject)
        } else {
            alert('Only Science subject available in MVP')
        }
    }

    const modules = selectedSubject === 'Science' ? [
        { name: 'Biology', icon: '🧬' }
    ] : []

    // Inline styles with animations
    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        zIndex: -1,
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'transparent',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
    }

    const cardStyle = {
        display: mounted ? 'block' : 'none',
        animation: mounted ? 'fadeInUp 0.8s ease-out forwards' : 'none',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    }

    const titleStyle = {
        marginBottom: 10,
        color: '#333',
        fontWeight: '300',
        fontSize: '2.2rem',
        letterSpacing: '1px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease 0.2s',
    }

    const subtitleStyle = {
        marginBottom: 30,
        color: '#555',
        fontWeight: '600',
        fontSize: '1.4rem',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease 0.3s',
    }

    const listStyle = {
        listStyleType: 'none',
        padding: 0,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'center',
        gap: 15,
        flexWrap: 'wrap',
    }

    const listItemStyle = {
        margin: 0,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.4s', // Staggered entrance for list items
    }

    const buttonStyle = {
        padding: '16px 30px',
        fontSize: '1.1rem',
        borderRadius: '50px',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transform: 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 140,
    }

    const backButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        color: '#4f46e5',
        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
    }

    const logoutButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)',
        display: 'block',
        margin: '15px auto 0',
        width: 'fit-content',
    }

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        flexWrap: 'wrap',
        marginTop: 15,
    }

    if (selectedSubject && modules.length > 0) {
        return (
            <>
                <div style={backgroundStyle} />
                <style>{`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes progressFill {
                        from { width: 0%; }
                    }
                `}</style>
                <div style={containerStyle}>
                    <div style={cardStyle}>
                        <h2 style={titleStyle}>Welcome, {user.username}</h2>
                        <LevelXPDisplay
                            level={level}
                            xp={progress.xp}
                            xpIn={xpIn}
                            xpNext={xpNext}
                            xpPercent={xpPercent}
                            mounted={mounted}
                        />
                        <h3 style={subtitleStyle}>
                            Grade {grade} - {selectedSubject}
                        </h3>
                        <h4 style={{ ...subtitleStyle, fontSize: '1.2rem', marginBottom: 20 }}>
                            Modules
                        </h4>
                        <ul style={listStyle}>
                            {modules.map((m, index) => (
                                <li key={m.name} style={{ ...listItemStyle, transitionDelay: `${0.5 + index * 0.1}s` }}>
                                    <button
                                        style={buttonStyle}
                                        onClick={() => navigate('/lesson', { state: { subject: selectedSubject, module: m.name } })}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                            e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                                            e.target.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)';
                                            e.target.style.backgroundSize = '200% 100%';
                                            e.target.style.animation = 'shimmer 1.5s ease-in-out infinite';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0) scale(1)';
                                            e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
                                            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                            e.target.style.backgroundSize = '100% 100%';
                                            e.target.style.animation = 'none';
                                        }}
                                    >
                                        {m.icon} {m.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div style={buttonContainerStyle}>
                            <button
                                style={backButtonStyle}
                                onClick={() => setSelectedSubject(null)}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.target.style.boxShadow = '0 12px 24px rgba(79, 70, 229, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.2)';
                                }}
                            >
                                ← Back to Subjects
                            </button>
                            <button
                                style={logoutButtonStyle}
                                onClick={() => {
                                    localStorage.removeItem('eduquest-user')
                                    navigate('/login')
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.target.style.boxShadow = '0 12px 24px rgba(239, 68, 68, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 8px 16px rgba(239, 68, 68, 0.3)';
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div style={backgroundStyle} />
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes progressFill {
                    from { width: 0%; }
                }
            `}</style>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={titleStyle}>Welcome, {user.username}</h2>
                    <LevelXPDisplay
                        level={level}
                        xp={progress.xp}
                        xpIn={xpIn}
                        xpNext={xpNext}
                        xpPercent={xpPercent}
                        mounted={mounted}
                    />
                    <h3 style={subtitleStyle}>Select Subject</h3>
                    <ul style={listStyle}>
                        {subjects.map((s, index) => (
                            <li key={s.name} style={{ ...listItemStyle, transitionDelay: `${0.5 + index * 0.1}s` }}>
                                <button
                                    style={s.name !== 'Science' ? { ...buttonStyle, opacity: 0.6, cursor: 'not-allowed' } : buttonStyle}
                                    onClick={() => handleSubjectClick(s.name)}
                                    onMouseEnter={(e) => {
                                        if (s.name === 'Science') {
                                            e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                            e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                                            e.target.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)';
                                            e.target.style.backgroundSize = '200% 100%';
                                            e.target.style.animation = 'shimmer 1.5s ease-in-out infinite';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (s.name === 'Science') {
                                            e.target.style.transform = 'translateY(0) scale(1)';
                                            e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
                                            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                            e.target.style.backgroundSize = '100% 100%';
                                            e.target.style.animation = 'none';
                                        }
                                    }}
                                    disabled={s.name !== 'Science'}
                                >
                                    {s.icon} {s.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        style={logoutButtonStyle}
                        onClick={() => {
                            localStorage.removeItem('eduquest-user')
                            navigate('/login')
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px) scale(1.02)';
                            e.target.style.boxShadow = '0 12px 24px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 8px 16px rgba(239, 68, 68, 0.3)';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

function LevelXPDisplay({ level, xp, xpIn, xpNext, xpPercent, mounted }) {
    return (
        <div style={{
            marginBottom: 30,
            textAlign: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.3s',
        }}>
            <h4 style={{
                marginBottom: 12,
                fontSize: '1.3rem',
                color: '#333',
                fontWeight: '500',
                letterSpacing: '0.5px',
            }}>
                Level {level} &nbsp;|&nbsp; Total XP: {xp}
            </h4>
            <div style={{
                backgroundColor: 'rgba(224, 231, 255, 0.8)',
                borderRadius: 10,
                height: 12,
                width: '80%',
                margin: '0 auto',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            }}>
                <div
                    style={{
                        height: '100%',
                        width: `${xpPercent}%`,
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderRadius: 10,
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: mounted ? 'progressFill 1.5s ease-out forwards' : 'none',
                        boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                    }}
                ></div>
            </div>
            <small style={{
                color: '#666',
                fontSize: '0.9rem',
                display: 'block',
                marginTop: 8,
            }}>
                {xpIn} XP / {xpNext} XP to next level ({xpPercent}%)
            </small>
        </div>
    )
}
