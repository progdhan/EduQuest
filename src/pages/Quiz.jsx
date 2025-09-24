import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { dbPromise, STORE_PROGRESS } from '../App'

const quizQuestions = [
    {
        question: 'Which cell component contains DNA?',
        options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Cytoplasm'],
        answer: 'Nucleus'
    },
    {
        question: 'What produces energy for the cell?',
        options: ['Cell membrane', 'Mitochondria', 'Nucleus', 'Ribosomes'],
        answer: 'Mitochondria'
    },
    {
        question: 'Which part controls what enters and exits the cell?',
        options: ['Cell membrane', 'Nucleus', 'Cytoplasm', 'Ribosomes'],
        answer: 'Cell membrane'
    },
    {
        question: 'Ribosomes are responsible for making _____?',
        options: ['Lipids', 'Proteins', 'Carbohydrates', 'RNA'],
        answer: 'Proteins'
    },
    {
        question: 'Which component is called the “powerhouse” of the cell?',
        options: ['Nucleus', 'Ribosomes', 'Mitochondria', 'Cytoplasm'],
        answer: 'Mitochondria'
    }
]

export default function Quiz() {
    const navigate = useNavigate()
    const location = useLocation()
    const { subject, module, lessonId } = location.state || {}

    const [user, setUser] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [xpEarned, setXpEarned] = useState(0)
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

    if (!user || !subject || !module || !lessonId) return null

    function selectOption(option) {
        setAnswers({ ...answers, [currentQ]: option })
    }

    function nextQuestion() {
        if (answers[currentQ] === undefined) {
            alert('Please select an answer')
            return
        }
        if (currentQ < quizQuestions.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            calculateScore()
        }
    }

    async function calculateScore() {
        let correct = 0
        quizQuestions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++
        })
        setScore(correct)
        const xp = correct * 10
        setXpEarned(xp)

        const db = await dbPromise
        let progress = await db.get(STORE_PROGRESS, user.username)
        if (!progress) {
            progress = { username: user.username, xp: 0, completedLessons: [] }
        }

        let isFirstTime = !progress.completedLessons.includes(lessonId)
        if (isFirstTime) {
            progress.completedLessons.push(lessonId)
            progress.xp += xp
        } else {
            // optionally: do not add xp again if re-taking
            // progress.xp += 0
            // or allow re-take xp (your existing logic)
            progress.xp += xp
        }

        await db.put(STORE_PROGRESS, progress)

        // Dispatch event so teacher dashboard updates
        window.dispatchEvent(new Event('progress-updated'))

        setShowResult(true)
    }

    function finish() {
        navigate('/student')
    }

    function handleCancel() {
        const confirmed = window.confirm(
            'Are you sure you want to cancel? You will lose this quiz progress.'
        )
        if (confirmed) {
            navigate('/student')
        }
    }

    const q = quizQuestions[currentQ]

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
        maxWidth: '600px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    }

    const titleStyle = {
        fontSize: '1.6rem',
        marginBottom: 20,
        color: '#333',
        fontWeight: '300',
        letterSpacing: '0.5px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease 0.2s',
    }

    const questionStyle = {
        fontSize: '1.3rem',
        marginBottom: 25,
        color: '#374151',
        fontWeight: '500',
        lineHeight: '1.5',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease 0.3s',
    }

    const optionsStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 30,
        textAlign: 'left',
    }

    const optionStyle = {
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        padding: '14px 18px',
        background: 'rgba(224, 231, 255, 0.3)',
        borderRadius: 12,
        border: '2px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
    }

    const selectedOptionStyle = {
        ...optionStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderColor: '#667eea',
        transform: 'scale(1.02)',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    }

    const actionsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 20,
    }

    const buttonStyle = {
        padding: '14px 28px',
        fontSize: '1rem',
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
        minWidth: 120,
    }

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        color: '#4f46e5',
        boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
    }

    const resultTitleStyle = {
        ...titleStyle,
        fontSize: '2rem',
        marginBottom: 30,
    }

    const resultTextStyle = {
        fontSize: '1.2rem',
        marginBottom: 15,
        color: '#333',
        fontWeight: '500',
        opacity: showResult ? 1 : 0,
        transform: showResult ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease 0.4s',
    }

    const reviewSectionStyle = {
        marginTop: 30,
        textAlign: 'left',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: 10,
    }

    const reviewItemStyle = {
        marginBottom: 20,
        padding: '16px',
        background: 'rgba(224, 231, 255, 0.3)',
        borderRadius: 12,
        borderLeft: '4px solid #667eea',
        transition: 'all 0.3s ease',
        opacity: showResult ? 1 : 0,
        transform: showResult ? 'translateY(0)' : 'translateY(10px)',
        transitionDelay: showResult ? '0.5s' : 'none',
    }

    const correctStyle = {
        color: '#10b981',
        fontWeight: '600',
    }

    const incorrectStyle = {
        color: '#ef4444',
        fontWeight: '600',
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
                @keyframes optionSelect {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1.02); }
                }
            `}</style>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    {!showResult ? (
                        <>
                            <h2 style={titleStyle}>
                                Question {currentQ + 1} of {quizQuestions.length}
                            </h2>
                            <p style={questionStyle}>{q.question}</p>
                            <div style={optionsStyle}>
                                {q.options.map((opt, idx) => (
                                    <label
                                        key={opt}
                                        style={answers[currentQ] === opt ? selectedOptionStyle : optionStyle}
                                        onClick={() => selectOption(opt)}
                                        onMouseEnter={(e) => {
                                            if (answers[currentQ] !== opt) {
                                                e.target.style.transform = 'scale(1.01)';
                                                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                                e.target.style.borderColor = '#667eea';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (answers[currentQ] !== opt) {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.background = 'rgba(224, 231, 255, 0.3)';
                                                e.target.style.borderColor = 'transparent';
                                            }
                                        }}
                                        onAnimationStart={() => {
                                            if (answers[currentQ] === opt) {
                                                e.target.style.animation = 'optionSelect 0.3s ease';
                                            }
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQ}`}
                                            checked={answers[currentQ] === opt}
                                            onChange={() => selectOption(opt)}
                                            style={{ marginRight: 12, transform: 'scale(1.2)', accentColor: '#667eea' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>

                            <div style={actionsStyle}>
                                <button
                                    onClick={nextQuestion}
                                    style={buttonStyle}
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
                                    {currentQ === quizQuestions.length - 1 ? 'Submit' : 'Next'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    style={secondaryButtonStyle}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                        e.target.style.boxShadow = '0 12px 24px rgba(79, 70, 229, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0) scale(1)';
                                        e.target.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.2)';
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style={resultTitleStyle}>🎉 Quiz Completed!</h2>
                            <p style={resultTextStyle}>
                                <strong>Score:</strong> {score} / {quizQuestions.length}
                            </p>
                            <p style={resultTextStyle}>
                                <strong>XP Earned:</strong> {xpEarned}
                            </p>

                            <div style={reviewSectionStyle}>
                                <h3 style={{
                                    marginBottom: 20,
                                    color: '#333',
                                    fontSize: '1.3rem',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                }}>
                                    Review Your Answers
                                </h3>
                                {quizQuestions.map((q, i) => (
                                    <div key={i} style={reviewItemStyle}>
                                        <p style={{ marginBottom: 8, fontWeight: '600', color: '#555' }}>
                                            Q{i + 1}: {q.question}
                                        </p>
                                        <p style={{ marginBottom: 4 }}>
                                            Your answer: <span style={answers[i] === q.answer ? correctStyle : incorrectStyle}>{answers[i]}</span> {answers[i] === q.answer ? '✅' : '❌'}
                                        </p>
                                        {answers[i] !== q.answer && (
                                            <p style={{
                                                color: '#10b981',
                                                fontWeight: '600',
                                                margin: 0,
                                            }}>
                                                Correct answer: {q.answer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={actionsStyle}>
                                <button
                                    onClick={finish}
                                    style={buttonStyle}
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
                                    Back to Dashboard
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
