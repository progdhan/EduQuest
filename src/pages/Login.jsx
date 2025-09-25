import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbPromise, STORE_USERS } from '../App'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Trigger entrance animation after component mounts
        const timer = setTimeout(() => setMounted(true), 100)
        return () => clearTimeout(timer)
    }, [])

    async function handleLogin(e) {
        e.preventDefault()
        setError('')

        if (!username.trim() || !password) {
            setError('Please enter both username and password')
            return
        }

        setLoading(true)
        try {
            const db = await dbPromise
            const user = await db.get(STORE_USERS, username.trim())

            if (!user) {
                setError('User  not found. Try student1, student2, or teacher')
                setLoading(false)
                return
            }

            // Password is dummy here, so no actual check
            // In real app, check hashed password here

            // Simulate slight delay for login UX
            setTimeout(() => {
                setLoading(false)
                localStorage.setItem('eduquest-user', JSON.stringify(user))
                if (user.role === 'teacher') navigate('/teacher')
                else navigate('/student')
            }, 800)
        } catch (err) {
            setError('Login failed. Please try again.')
            setLoading(false)
        }
    }

    // Inline styles with enhanced animations
    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite', // Animated gradient
        zIndex: -1,
    }

    const formStyle = {
        display: mounted ? 'block' : 'none', // Simple show/hide for entrance
        animation: mounted ? 'fadeInUp 0.8s ease-out forwards' : 'none',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    }

    const inputStyle = {
        width: '100%',
        padding: '16px 20px 16px 50px',
        borderRadius: '50px',
        border: '2px solid #e1e5e9',
        fontSize: '16px',
        boxSizing: 'border-box',
        background: '#f8f9fa',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing
        outline: 'none',
        transform: 'scale(1)',
    }

    const buttonStyle = {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: '600',
        fontSize: '16px',
        borderRadius: '50px',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: !username.trim() || !password || loading ? 0.7 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transform: 'scale(1)',
    }

    const iconStyle = {
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#667eea',
        fontSize: '18px',
        transition: 'all 0.3s ease',
    }

    const errorStyle = {
        marginTop: '20px',
        color: '#e74c3c',
        fontWeight: '500',
        fontSize: '14px',
        opacity: 0,
        transform: 'translateY(10px)',
        transition: 'all 0.3s ease',
        ...(error && { opacity: 1, transform: 'translateY(0)' }), // Animate error appearance
    }

    return (
        <>
            {/* Animated Gradient Background */}
            <div style={backgroundStyle} />

            {/* Global Styles for Animations (injected via style tag for keyframes) */}
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
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'transparent', // Transparent to show animated gradient
                    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                    padding: '20px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Background decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        pointerEvents: 'none',
                        animation: 'gradientShift 15s ease infinite', // Sync with background
                        opacity: 0.5,
                    }}
                />

                <form onSubmit={handleLogin} style={formStyle}>
                    {/* Decorative top element with subtle rotation animation */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 60,
                            height: 60,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '24px',
                            boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                            transition: 'all 0.3s ease',
                            animation: 'pulse 2s ease-in-out infinite', // Gentle pulse
                        }}
                    >
                        E
                    </div>

                    <h2
                        style={{
                            marginBottom: '40px',
                            color: '#333',
                            fontSize: '28px',
                            fontWeight: '300',
                            letterSpacing: '1px',
                            opacity: mounted ? 1 : 0,
                            transition: 'opacity 0.5s ease 0.2s', // Staggered entrance
                        }}
                    >
                        Vectus Login
                    </h2>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                ...inputStyle,
                                ...(username && { borderColor: '#667eea', background: 'white', transform: 'scale(1.02)' }), // Subtle scale on input
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.background = 'white';
                                e.target.style.transform = 'scale(1.02)';
                                // Animate icon
                                e.target.parentElement.querySelector('span').style.color = '#4a90e2';
                                e.target.parentElement.querySelector('span').style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onBlur={(e) => {
                                if (!username) {
                                    e.target.style.borderColor = '#e1e5e9';
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.transform = 'scale(1)';
                                }
                                // Reset icon
                                e.target.parentElement.querySelector('span').style.color = '#667eea';
                                e.target.parentElement.querySelector('span').style.transform = 'translateY(-50%) scale(1)';
                            }}
                            autoComplete="username"
                            disabled={loading}
                        />
                        <span style={iconStyle}>👤</span>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '30px' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                ...inputStyle,
                                ...(password && { borderColor: '#667eea', background: 'white', transform: 'scale(1.02)' }),
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.background = 'white';
                                e.target.style.transform = 'scale(1.02)';
                                e.target.parentElement.querySelector('span').style.color = '#4a90e2';
                                e.target.parentElement.querySelector('span').style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onBlur={(e) => {
                                if (!password) {
                                    e.target.style.borderColor = '#e1e5e9';
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.transform = 'scale(1)';
                                }
                                e.target.parentElement.querySelector('span').style.color = '#667eea';
                                e.target.parentElement.querySelector('span').style.transform = 'translateY(-50%) scale(1)';
                            }}
                            autoComplete="current-password"
                            disabled={loading}
                        />
                        <span style={iconStyle}>🔒</span>
                    </div>

                    <button
                        type="submit"
                        disabled={!username.trim() || !password || loading}
                        style={buttonStyle}
                        onMouseEnter={(e) => {
                            if (!loading && username.trim() && password) {
                                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                e.target.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.4)';
                                // Add shimmer effect via pseudo-element simulation (background animation)
                                e.target.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)';
                                e.target.style.backgroundSize = '200% 100%';
                                e.target.style.animation = 'shimmer 1.5s ease-in-out infinite';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            e.target.style.backgroundSize = '100% 100%';
                            e.target.style.animation = 'none';
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Logging in...
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    borderTop: '2px solid white',
                                    marginLeft: 8,
                                    animation: 'spin 1s linear infinite',
                                }} />
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    {error && <p style={errorStyle}>{error}</p>}

                    <p
                        style={{
                            marginTop: '30px',
                            fontSize: '12px',
                            color: '#7f8c8d',
                            lineHeight: '1.4',
                            opacity: mounted ? 1 : 0,
                            transition: 'opacity 0.5s ease 0.4s', // Staggered entrance
                        }}
                    >
                        For demo use: <br />
                        <strong>student1</strong>, <strong>student2</strong>, or <strong>teacher</strong> <br />
                        Password can be anything
                    </p>
                </form>
            </div>

            {/* Additional keyframe for spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}
