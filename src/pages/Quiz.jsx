import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dbPromise, STORE_PROGRESS } from '../App';

const quizQuestions = [
    { question: 'Which cell component contains DNA?', options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Cytoplasm'], answer: 'Nucleus' },
    { question: 'What produces energy for the cell?', options: ['Cell membrane', 'Mitochondria', 'Nucleus', 'Ribosomes'], answer: 'Mitochondria' },
    { question: 'Which part controls what enters and exits the cell?', options: ['Cell membrane', 'Nucleus', 'Cytoplasm', 'Ribosomes'], answer: 'Cell membrane' },
    { question: 'Ribosomes are responsible for making _____?', options: ['Lipids', 'Proteins', 'Carbohydrates', 'RNA'], answer: 'Proteins' },
    { question: 'Which component is called the “powerhouse” of the cell?', options: ['Nucleus', 'Ribosomes', 'Mitochondria', 'Cytoplasm'], answer: 'Mitochondria' }
];

export default function Quiz() {
    const navigate = useNavigate();
    const location = useLocation();
    const { subject, module, lessonId } = location.state || {};

    const [user, setUser] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [heroAnim, setHeroAnim] = useState(false);
    const [monsterAnim, setMonsterAnim] = useState(false);
    const [monsterAnimType, setMonsterAnimType] = useState(''); // 'hit' or 'attack'
    const [effectAnim, setEffectAnim] = useState(''); // 'lightning' or 'fireball'
    const [monsterHP, setMonsterHP] = useState(quizQuestions.length);
    const [heroHP, setHeroHP] = useState(quizQuestions.length);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'));
        if (!userData || userData.role !== 'student') {
            navigate('/login');
            return;
        }
        setUser(userData);
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, [navigate]);

    if (!user || !subject || !module || !lessonId) return null;

    function selectOption(option) {
        setAnswers({ ...answers, [currentQ]: option });
    }

    function nextQuestion() {
        if (answers[currentQ] === undefined) {
            alert('Please select an answer');
            return;
        }
        const isCorrect = answers[currentQ] === quizQuestions[currentQ].answer;
        if (isCorrect) {
            setHeroAnim(true);
            setEffectAnim('lightning');
            setTimeout(() => {
                setHeroAnim(false);
                setEffectAnim('');
                setMonsterAnimType('hit');
                setMonsterAnim(true);
                setMonsterHP((hp) => Math.max(0, hp - 1));
                setTimeout(() => setMonsterAnim(false), 600);
                if (currentQ < quizQuestions.length - 1) {
                    setCurrentQ(currentQ + 1);
                } else {
                    calculateScore();
                }
            }, 600);
        } else {
            setMonsterAnimType('attack');
            setEffectAnim('fireball');
            setMonsterAnim(true);
            setTimeout(() => {
                setMonsterAnim(false);
                setEffectAnim('');
                setHeroAnim(true);
                setHeroHP((hp) => Math.max(0, hp - 1));
                setTimeout(() => setHeroAnim(false), 600);
                if (currentQ < quizQuestions.length - 1) {
                    setCurrentQ(currentQ + 1);
                } else {
                    calculateScore();
                }
            }, 600);
        }
    }

    async function calculateScore() {
        let correct = 0;
        quizQuestions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });
        setScore(correct);
        const xp = correct * 10;
        setXpEarned(xp);

        const db = await dbPromise;
        let progress = await db.get(STORE_PROGRESS, user.username);
        if (!progress) progress = { username: user.username, xp: 0, completedLessons: [] };

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }
        progress.xp += xp;

        await db.put(STORE_PROGRESS, progress);
        window.dispatchEvent(new Event('progress-updated'));
        setShowResult(true);
    }

    function finish() {
        navigate('/student');
    }

    function handleCancel() {
        if (window.confirm('Are you sure you want to cancel? You will lose this quiz progress.')) {
            navigate('/student');
        }
    }

    const q = quizQuestions[currentQ];

    // Background style
    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1f1f2e, #3a3a5a)',
        overflow: 'hidden',
        zIndex: -1,
    };

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
    });

    // Card style
    const cardStyle = {
        display: mounted ? 'block' : 'none',
        animation: mounted ? 'fadeInUp 0.8s ease-out forwards' : 'none',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        background: 'rgba(0,0,0,0.7)',
        padding: '40px 30px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        width: '90%',
        maxWidth: '500px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        color: 'white',
    };

    // Option styles
    const optionsStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '30px',
        textAlign: 'left',
    };

    const optionStyle = {
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        padding: '12px 18px',
        borderRadius: '50px',
        border: '2px solid transparent',
        background: '#2a2a40',
        transition: 'all 0.3s ease',
    };

    const hoverOptionStyle = {
        transform: 'scale(1.03)',
        background: '#3a3a5a',
        borderColor: '#667eea',
    };

    const selectedOptionStyle = {
        ...optionStyle,
        background: '#667eea',
        color: 'white',
        borderColor: '#764ba2',
        transform: 'scale(1.05)',
    };

    const buttonStyle = {
        padding: '12px 24px',
        borderRadius: '50px',
        border: 'none',
        background: '#667eea',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        margin: '5px',
        transition: 'all 0.3s ease',
    };

    return (
        <>
            <div style={backgroundStyle}>
                <div style={shapeStyle('80px', '10%', '20%', 0, '#667eea')} />
                <div style={shapeStyle('120px', '70%', '10%', 2, '#764ba2')} />
                <div style={shapeStyle('60px', '50%', '80%', 1, '#f093fb')} />
                <div style={shapeStyle('100px', '30%', '60%', 3, '#f5576c')} />
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {opacity:0; transform:translateY(30px);}
                    to {opacity:1; transform:translateY(0);}
                }
                @keyframes floatShape {
                    0% {transform: translateY(0);}
                    50% {transform: translateY(-20px);}
                    100% {transform: translateY(0);}
                }
                @keyframes heroAttack {
                    0% { transform: translateX(0); }
                    40% { transform: translateX(30px) scale(1.1); }
                    60% { transform: translateX(-10px) scale(1.05); }
                    100% { transform: translateX(0); }
                }
                @keyframes monsterHit {
                    0% { filter: brightness(1); }
                    20% { filter: brightness(1.3) drop-shadow(0 0 8px #f5576c); transform: scale(1.08) rotate(-5deg); }
                    60% { filter: brightness(0.8); transform: scale(0.95) rotate(5deg); }
                    100% { filter: brightness(1); transform: scale(1) rotate(0deg); }
                }
                @keyframes monsterAttack {
                    0% { transform: scale(1) translateX(0); }
                    30% { transform: scale(1.15) translateX(-18px) rotate(-8deg); filter: brightness(1.2) drop-shadow(0 0 12px #f5576c); }
                    60% { transform: scale(0.95) translateX(10px) rotate(8deg); filter: brightness(0.8); }
                    100% { transform: scale(1) translateX(0); filter: brightness(1); }
                }
                @keyframes monsterDefeat {
                    0% { opacity: 1; }
                    100% { opacity: 0.2; filter: grayscale(1); }
                }
                @keyframes lightning {
                    0% { opacity: 0; transform: scaleY(0.2) translateX(0); }
                    10% { opacity: 1; transform: scaleY(1.1) translateX(0); }
                    80% { opacity: 1; transform: scaleY(1) translateX(120px); }
                    100% { opacity: 0; transform: scaleY(0.2) translateX(120px); }
                }
                @keyframes fireball {
                    0% { opacity: 0; transform: scale(0.5) translateX(0); }
                    10% { opacity: 1; transform: scale(1.1) translateX(0); }
                    80% { opacity: 1; transform: scale(1) translateX(-120px); }
                    100% { opacity: 0; transform: scale(0.5) translateX(-120px); }
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
                <div style={cardStyle}>
                    {/* Hero vs Monster Battle UI */}
                    {!showResult && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, position: 'relative' }}>
                            {/* Hero */}
                            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 120 }}>
                                <span
                                    style={{
                                        fontSize: '3.2rem',
                                        display: 'inline-block',
                                        transition: 'filter 0.3s',
                                        animation: heroAnim ? 'heroAttack 0.6s' : 'none',
                                    }}
                                    role="img"
                                    aria-label="Hero"
                                >🦸‍♂️</span>
                                <div style={{ fontSize: '1rem', marginTop: 8, color: '#aaf', fontWeight: 500 }}>Hero</div>
                                <div style={{ marginTop: 10, width: 90, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <div style={{ height: 8, borderRadius: 4, background: '#222', marginBottom: 2 }}>
                                        <div style={{ width: `${(heroHP / quizQuestions.length) * 100}%`, height: '100%', borderRadius: 4, background: heroHP === 0 ? '#aaa' : '#667eea', transition: 'width 0.4s cubic-bezier(.4,0,.2,1)' }} />
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: 500 }}>{heroHP} HP</div>
                                </div>
                            </div>
                            {/* Effect Animation */}
                            {effectAnim === 'lightning' && (
                                <div style={{ position: 'absolute', left: 'calc(20% + 40px)', top: '40px', zIndex: 2, pointerEvents: 'none' }}>
                                    <svg width="120" height="32" style={{ display: 'block' }}>
                                        <polyline points="0,16 40,10 60,22 90,6 120,16" stroke="#f7e600" strokeWidth="5" fill="none" style={{ filter: 'drop-shadow(0 0 8px #f7e600)' }}>
                                            <animate attributeName="stroke" values="#f7e600;#fff;#f7e600" dur="0.6s" repeatCount="1" />
                                        </polyline>
                                    </svg>
                                    <div style={{ position: 'absolute', left: 110, top: 8, fontSize: 22, color: '#f7e600', animation: 'lightning 0.6s' }}>⚡</div>
                                </div>
                            )}
                            {effectAnim === 'fireball' && (
                                <div style={{ position: 'absolute', right: 'calc(20% + 40px)', top: '40px', zIndex: 2, pointerEvents: 'none' }}>
                                    <svg width="120" height="32" style={{ display: 'block' }}>
                                        <circle cx="120" cy="16" r="14" fill="#f5576c" style={{ filter: 'drop-shadow(0 0 12px #f5576c)' }}>
                                            <animate attributeName="fill" values="#f5576c;#fff;#f5576c" dur="0.6s" repeatCount="1" />
                                        </circle>
                                    </svg>
                                    <div style={{ position: 'absolute', left: 0, top: 8, fontSize: 22, color: '#f5576c', animation: 'fireball 0.6s' }}>🔥</div>
                                </div>
                            )}
                            {/* Monster */}
                            <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 120 }}>
                                <span
                                    style={{
                                        fontSize: '3.2rem',
                                        display: 'inline-block',
                                        transition: 'filter 0.3s',
                                        animation: monsterAnim
                                            ? (monsterHP === 0
                                                ? 'monsterDefeat 0.8s forwards'
                                                : monsterAnimType === 'attack'
                                                    ? 'monsterAttack 0.6s'
                                                    : 'monsterHit 0.6s')
                                            : 'none',
                                    }}
                                    role="img"
                                    aria-label="Monster"
                                >👹</span>
                                <div style={{ fontSize: '1rem', marginTop: 8, color: '#faa', fontWeight: 500 }}>Monster</div>
                                <div style={{ marginTop: 10, width: 90, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <div style={{ height: 8, borderRadius: 4, background: '#222', marginBottom: 2 }}>
                                        <div style={{ width: `${(monsterHP / quizQuestions.length) * 100}%`, height: '100%', borderRadius: 4, background: monsterHP === 0 ? '#aaa' : '#f5576c', transition: 'width 0.4s cubic-bezier(.4,0,.2,1)' }} />
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#f5576c', fontWeight: 500 }}>{monsterHP} HP</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ...existing code... */}
                    {!showResult ? (
                        <>
                            <h2 style={{ marginBottom: '20px' }}>Question {currentQ + 1} / {quizQuestions.length}</h2>
                            <p style={{ marginBottom: '20px' }}>{q.question}</p>

                            <div style={optionsStyle}>
                                {q.options.map((opt) => (
                                    <label
                                        key={opt}
                                        style={answers[currentQ] === opt ? selectedOptionStyle : optionStyle}
                                        onClick={() => selectOption(opt)}
                                        onMouseEnter={(e) => {
                                            if (answers[currentQ] !== opt) Object.assign(e.currentTarget.style, hoverOptionStyle);
                                        }}
                                        onMouseLeave={(e) => {
                                            if (answers[currentQ] !== opt) Object.assign(e.currentTarget.style, optionStyle);
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQ}`}
                                            checked={answers[currentQ] === opt}
                                            onChange={() => selectOption(opt)}
                                            style={{ marginRight: '12px', transform: 'scale(1.2)', accentColor: '#667eea' }}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>

                            <div>
                                <button style={buttonStyle} onClick={nextQuestion}>
                                    {currentQ === quizQuestions.length - 1 ? 'Submit' : 'Next'}
                                </button>
                                <button style={{ ...buttonStyle, background: '#555' }} onClick={handleCancel}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style={{ marginBottom: '20px' }}>
                                {score >= 3 ? '� Monster Defeated!' : '💀 Hero Defeated!'}
                            </h2>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
                                <span style={{ fontSize: '3.2rem', marginRight: 18, filter: score >= 3 ? 'none' : 'grayscale(1) opacity(0.3)' }}>🦸‍♂️</span>
                                <span style={{ fontSize: '3.2rem', filter: score >= 3 ? 'grayscale(1) opacity(0.3)' : 'none' }}>👹</span>
                            </div>
                            <p>Score: {score} / {quizQuestions.length}</p>
                            <p>XP Earned: {xpEarned}</p>

                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                {quizQuestions.map((q, i) => (
                                    <div key={i} style={{ marginBottom: '15px', padding: '10px', background: '#2a2a40', borderRadius: '15px' }}>
                                        <p>Q{i + 1}: {q.question}</p>
                                        <p>Your answer: {answers[i]} {answers[i] === q.answer ? '✅' : '❌'}</p>
                                        {answers[i] !== q.answer && <p>Correct: {q.answer}</p>}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <button style={buttonStyle} onClick={finish}>Back to Dashboard</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
