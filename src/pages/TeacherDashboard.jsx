import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbPromise, STORE_USERS, STORE_PROGRESS } from '../App'

export default function TeacherDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [students, setStudents] = useState([])

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'teacher') {
            navigate('/login')
            return
        }
        setUser(userData)

        async function loadStudents() {
            const db = await dbPromise
            const allUsers = await db.getAll(STORE_USERS)
            const studentUsers = allUsers.filter(u => u.role === 'student')

            // --- Load progress from IndexedDB ---
            const allProgress = await db.getAll(STORE_PROGRESS)

            // --- Merge user info with progress ---
            const merged = studentUsers.map(s => {
                const prog = allProgress.find(p => p.username === s.username) || {
                    xp: 0,
                    completedLessons: []
                }
                return {
                    username: s.username,
                    grade: s.grade,
                    xp: prog.xp,
                    lessons: prog.completedLessons.length
                }
            })

            setStudents(merged)
        }

        loadStudents()
    }, [])

    if (!user) return null

    return (
        <div style={{ padding: 20 }}>
            <h2>Teacher Dashboard</h2>
            <h3>Student Progress</h3>

            <table
                border="1"
                cellPadding="10"
                style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}
            >
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Grade</th>
                        <th>XP</th>
                        <th>Lessons Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.username}>
                            <td>{s.username}</td>
                            <td>{s.grade}</td>
                            <td>{s.xp}</td>
                            <td>{s.lessons}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
