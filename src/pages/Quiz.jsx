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

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'student') {
            navigate('/login')
            return
        }
        setUser(userData)
    }, [])

    if (!user || !subject || !module || !lessonId) return null

    function selectOption(option) {
        setAnswers({ ...answers, [currentQ]: option })
    }

    async function calculateScore() {
        let correct = 0
        quizQuestions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++
        })
        setScore(correct)
        const xp = correct * 10
        setXpEarned(xp)

        // --- Save progress to IndexedDB ---
        const db = await dbPromise
        const progress = (await db.get(STORE_PROGRESS, user.username)) || {
            username: user.username,
            xp: 0,
            completedLessons: []
        }
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId)
            progress.xp += xp
            await db.put(STORE_PROGRESS, progress)
        }

        // --- Save progress to localStorage for offline check ---
        const localProgress = JSON.parse(localStorage.getItem('progress')) || {}
        localProgress[user.username] = localProgress[user.username] || { xp: 0, lessonsCompleted: 0 }
        localProgress[user.username].xp += xp
        localProgress[user.username].lessonsCompleted += 1
        localStorage.setItem('progress', JSON.stringify(localProgress))

        setShowResult(true)
    }

    function finish() {
        navigate('/student')
    }

    if (showResult) {
        return (
            <div style={{ padding: 20 }}>
                <h2>Quiz Completed!</h2>
                <p>
                    Score: {score} / {quizQuestions.length}
                </p>
                <p>XP Earned: {xpEarned}</p>
                <button onClick={finish}>Back to Dashboard</button>
            </div>
        )
    }

    const q = quizQuestions[currentQ]

    return (
        <div style={{ padding: 20 }}>
            <h3>
                Question {currentQ + 1} of {quizQuestions.length}
            </h3>
            <p>{q.question}</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {q.options.map(opt => (
                    <li key={opt}>
                        <label>
                            <input
                                type="radio"
                                name={`answer-${currentQ}`}
                                checked={answers[currentQ] === opt}
                                onChange={() => selectOption(opt)}
                            />{' '}
                            {opt}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={() => (currentQ === quizQuestions.length - 1 ? calculateScore() : setCurrentQ(currentQ + 1))}>
                {currentQ === quizQuestions.length - 1 ? 'Submit' : 'Next'}
            </button>
        </div>
    )
}
