import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const lessonContent = {
    title: 'Components of Cell',
    text: [
        'Nucleus: Controls cell activities and contains DNA.',
        'Cytoplasm: Jelly-like substance where cell processes happen.',
        'Cell membrane: Protects the cell and controls what enters/exits.',
        'Mitochondria: Produces energy for the cell.',
        'Ribosomes: Make proteins.'
    ],
    image: '/images/cell-diagram.png'  // Make sure image exists here
}

export default function Lesson() {
    const navigate = useNavigate()
    const location = useLocation()
    const { subject, module } = location.state || {}
    const [user, setUser] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'student') {
            navigate('/login')
            return
        }
        setUser(userData)

        // Trigger entrance animation
        const timer = setTimeout(() => setMounted(true), 100)
        return () => clearTimeout(timer)
    }, [navigate])

    if (!user || !subject || !module) return null

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
        maxWidth: '700px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    }

    const headingStyle = {
        marginBottom: 30,
        color: '#333',
        fontWeight: '300',
        fontSize: '2rem',
        letterSpacing: '1px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease 0.2s',
    }

    const imageContainerStyle = {
        marginBottom: 40,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.3s',
    }

    const cellImageStyle = {
        maxWidth: '100%',
        maxHeight: 300,
        width: 'auto',
        height: 'auto',
        borderRadius: 15,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        objectFit: 'contain',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }

    const lessonCardStyle = {
        background: 'transparent', // No extra card, integrate into main
        marginBottom: 40,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.4s',
    }

    const lessonListStyle = {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: '#374151',
        marginBottom: 30,
        paddingLeft: 0,
        listStyleType: 'none',
        textAlign: 'left',
    }

    const lessonItemStyle = {
        marginBottom: 15,
        padding: '12px 20px',
        background: 'rgba(224, 231, 255, 0.3)',
        borderRadius: 10,
        borderLeft: '4px solid #667eea',
        transition: 'all 0.3s ease',
        cursor: 'default',
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
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 160,
        margin: '0 10px',
    }

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        color: '#4f46e5',
        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
    }

    const buttonRowStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 20,
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
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={headingStyle}>
                        {subject} → {module}: {lessonContent.title}
                    </h2>

                    <div style={imageContainerStyle}>
                        <img
                            src={lessonContent.image}
                            alt="Cell Diagram"
                            style={cellImageStyle}
                            loading="lazy"
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.02)';
                                e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                            }}
                        />
                    </div>

                    <div style={lessonCardStyle}>
                        <ul style={lessonListStyle}>
                            {lessonContent.text.map((item, idx) => (
                                <li key={idx} style={{ ...lessonItemStyle, transitionDelay: `${0.5 + idx * 0.1}s` }}>
                                    <span style={{ marginRight: 10, fontSize: '1.2rem' }}>📚</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div style={buttonRowStyle}>
                            <button
                                style={buttonStyle}
                                onClick={() =>
                                    navigate('/quiz', {
                                        state: { subject, module, lessonId: 'components-cell' }
                                    })
                                }
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
                                🧠 Take Quiz
                            </button>

                            <button
                                style={secondaryButtonStyle}
                                onClick={() => navigate('/student')}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.target.style.boxShadow = '0 12px 24px rgba(79, 70, 229, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.2)';
                                }}
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
