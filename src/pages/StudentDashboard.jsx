import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const subjects = ['Science', 'Technology', 'Engineering', 'Mathematics']

export default function StudentDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [grade, setGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'student') {
            navigate('/login')
            return
        }
        setUser(userData)
        setGrade(userData.grade)
    }, [])

    if (!user) return null

    // Only Science leads to Biology module in MVP
    const handleSubjectClick = subject => {
        if (subject === 'Science') {
            setSelectedSubject(subject)
        } else {
            alert('Only Science subject available in MVP')
        }
    }

    // Modules for Science
    const modules = selectedSubject === 'Science' ? ['Biology'] : []

    if (selectedSubject && modules.length > 0) {
        return (
            <div style={{ padding: 20 }}>
                <h3>
                    Grade {grade} - {selectedSubject}
                </h3>
                <h4>Modules</h4>
                <ul>
                    {modules.map(m => (
                        <li key={m}>
                            <button onClick={() => navigate('/lesson', { state: { subject: selectedSubject, module: m } })}>
                                {m}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={() => setSelectedSubject(null)}>Back to Subjects</button>
            </div>
        )
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Welcome, {user.username}</h2>
            <h3>Select Subject</h3>
            <ul>
                {subjects.map(s => (
                    <li key={s}>
                        <button onClick={() => handleSubjectClick(s)}>{s}</button>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => {
                    localStorage.removeItem('eduquest-user')
                    navigate('/login')
                }}
                style={{ marginTop: 20 }}
            >
                Logout
            </button>
        </div>
    )
}
