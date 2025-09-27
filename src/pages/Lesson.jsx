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
    image: 'images/cell-diagram.png' // Ensure image exists
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

        const timer = setTimeout(() => setMounted(true), 100)
        return () => clearTimeout(timer)
    }, [navigate])

    if (!user || !subject || !module) return null

    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1f1f2e, #3a3a5a)',
        overflow: 'hidden',
        zIndex: -1,
    }

    const shapeStyle = (size, top, left, delay, color) => ({
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        top: top,
        left: left,
        animation: `floatShape 6s ease-in-out ${delay}s infinite alternate`,
        opacity: 0.4,
    })

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        position: 'relative',
        zIndex: 1,
    }

    const cardStyle = {
        display: mounted ? 'block' : 'none',
        animation: mounted ? 'fadeInUpCard 1s cubic-bezier(.4,0,.2,1) forwards' : 'none',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(40px)',
        background: 'rgba(30,30,50,0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        padding: '56px 32px 40px 32px',
        borderRadius: '28px',
        boxShadow: '0 24px 48px rgba(30,30,50,0.35)',
        width: '100%',
        maxWidth: '720px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        color: '#e0e0e0',
    }

    const headingStyle = {
        marginBottom: 30,
        color: '#fff',
        fontWeight: '600',
        fontSize: '2.2rem',
        letterSpacing: '1px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1) 0.2s',
        textShadow: '0 2px 12px #667eea44',
    }

    const imageContainerStyle = {
        marginBottom: 30,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.3s',
    }

    const cellImageStyle = {
        maxWidth: '100%',
        maxHeight: 300,
        borderRadius: 15,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        objectFit: 'contain',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }

    const lessonListStyle = {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: '#e0e0e0',
        marginBottom: 30,
        paddingLeft: '20px',
        textAlign: 'left',
    }

    const buttonStyle = {
        padding: '12px 28px',
        fontSize: '1.08rem',
        borderRadius: '50px',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 8px 24px rgba(102,126,234,0.18)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        margin: '0 7px',
        minWidth: 140,
        fontWeight: 500,
        letterSpacing: '0.5px',
    }

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        color: '#4f46e5',
        boxShadow: '0 8px 24px rgba(79,70,229,0.13)',
    }

    const buttonRowStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 20,
    }

    return (
        <>
            <div style={backgroundStyle}>
                <div style={shapeStyle('80px', '10%', '20%', 0, '#667eea')} />
                <div style={shapeStyle('120px', '70%', '10%', 2, '#764ba2')} />
                <div style={shapeStyle('60px', '50%', '80%', 1, '#f093fb')} />
                <div style={shapeStyle('100px', '30%', '60%', 3, '#f5576c')} />
            </div>

            <style>{`
                                @keyframes fadeInUpCard {
                                        from {opacity:0; transform:translateY(40px);}
                                        to {opacity:1; transform:translateY(0);}
                                }
                                @keyframes fadeInUp {
                                        from {opacity:0; transform:translateY(30px);}
                                        to {opacity:1; transform:translateY(0);}
                                }
                                @keyframes floatShape {
                                        0% {transform: translateY(0);}
                                        50% {transform: translateY(-20px);}
                                        100% {transform: translateY(0);}
                                }
                                .lesson-card button:hover:not(:disabled) {
                                    filter: brightness(1.08);
                                    box-shadow: 0 12px 32px rgba(102,126,234,0.32);
                                }
                                .lesson-card button:active:not(:disabled) {
                                    filter: brightness(0.95);
                                }
                                .lesson-card img {
                                    transition: transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1);
                                }
                                @media (max-width: 700px) {
                                    .lesson-card {
                                        padding: 18px 2vw 24px 2vw !important;
                                        border-radius: 18px !important;
                                        max-width: 98vw !important;
                                    }
                                    .lesson-card h2 {
                                        font-size: 1.3rem !important;
                                    }
                                }
                        `}</style>

            <div style={containerStyle}>
                <div style={cardStyle} className="lesson-card">
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
                                e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                            }}
                        />
                    </div>

                    <ul style={lessonListStyle}>
                        {lessonContent.text.map((item, idx) => (
                            <li
                                key={idx}
                                style={{
                                    marginBottom: 10,
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    animation: `fadeInItem 0.5s ease forwards`,
                                    animationDelay: `${0.3 + idx * 0.2}s`,
                                }}
                            >
                                📚 {item}
                            </li>
                        ))}
                    </ul>

                    <style>{`
    @keyframes fadeInItem {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`}</style>


                    <div style={buttonRowStyle}>
                        <button
                            style={buttonStyle}
                            onClick={() =>
                                navigate('/quiz', {
                                    state: { subject, module, lessonId: 'components-cell' },
                                })
                            }
                        >
                            🧠 Take Quiz
                        </button>

                        <button
                            style={secondaryButtonStyle}
                            onClick={() => navigate('/student')}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
