import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbPromise, STORE_PROGRESS, STORE_USERS } from '../App'
import Chart from 'chart.js/auto'

export default function TeacherDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [students, setStudents] = useState([])
    const [mounted, setMounted] = useState(false)

    const barRef = useRef(null)
    const pieRef = useRef(null)
    const barChart = useRef(null)
    const pieChart = useRef(null)

    async function loadStudents() {
        try {
            const db = await dbPromise
            const allUsers = await db.getAll(STORE_USERS)
            const studentUsers = allUsers.filter(u => u.role === 'student')
            const allProgress = await db.getAll(STORE_PROGRESS)

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

            merged.sort((a, b) => b.xp - a.xp)
            setStudents(merged)
        } catch (err) {
            console.error('Error loading students:', err)
        }
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'teacher') {
            navigate('/login')
            return
        }
        setUser(userData)
        loadStudents()

        const handler = () => {
            console.log('progress-updated event caught')
            loadStudents()
        }

        window.addEventListener('progress-updated', handler)

        const timer = setTimeout(() => setMounted(true), 100)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('progress-updated', handler)
            if (barChart.current) barChart.current.destroy()
            if (pieChart.current) pieChart.current.destroy()
        }
    }, [navigate])

    // Bar Chart
    useEffect(() => {
        if (!barRef.current) return
        if (barChart.current) barChart.current.destroy()

        const labels = students.map(s => s.username)
        const xpData = students.map(s => s.xp)
        const lessonsData = students.map(s => s.lessons)

        barChart.current = new Chart(barRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'XP',
                        data: xpData,
                        backgroundColor: '#4f46e5',
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                    {
                        label: 'Lessons Completed',
                        data: lessonsData,
                        backgroundColor: '#22c55e',
                        borderRadius: 8,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 14 },
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        ticks: { color: '#555' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#555' }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                }
            }
        })
    }, [students])

    // Pie Chart
    useEffect(() => {
        if (!pieRef.current) return
        if (pieChart.current) pieChart.current.destroy()

        const labels = students.map(s => s.username)
        const xpData = students.map(s => s.xp)

        pieChart.current = new Chart(pieRef.current, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        label: 'XP Share',
                        data: xpData,
                        backgroundColor: labels.map((_, i) =>
                            `hsl(${(i * 60) % 360}, 70%, 70%)`
                        ),
                        borderColor: '#fff',
                        borderWidth: 2,
                        hoverOffset: 10,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { size: 14 },
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                }
            }
        })
    }, [students])

    if (!user) return null

    // Styles
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
        padding: 20,
        fontFamily: 'Segoe UI, sans-serif',
    }

    const cardStyle = {
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '1000px',
        animation: mounted ? 'fadeInUp 1s ease-out' : 'none',
    }

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 30,
    }

    const tableHeaderStyle = {
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: 12,
        textAlign: 'left',
        fontWeight: 600,
    }

    const tableCellStyle = {
        padding: 12,
        borderBottom: '1px solid #eee',
        fontSize: '1rem',
    }

    const tableRowEvenStyle = { backgroundColor: '#f9f9f9' }
    const tableRowOddStyle = { backgroundColor: '#fff' }

    const chartsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 30,
    }

    const chartWrapperStyle = {
        flex: 1,
        minWidth: 280,
        height: 300,
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 15,
        padding: 20,
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    }

    const canvasStyle = {
        width: '100%',
        height: '100%',
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
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 20 }}>
                        Welcome, {user.username}
                    </h2>

                    {/* Table */}
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Username</th>
                                <th style={tableHeaderStyle}>Grade</th>
                                <th style={tableHeaderStyle}>XP</th>
                                <th style={tableHeaderStyle}>Lessons Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr
                                    key={s.username}
                                    style={i % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}
                                >
                                    <td style={tableCellStyle}>{s.username}</td>
                                    <td style={tableCellStyle}>{s.grade}</td>
                                    <td style={tableCellStyle}>{s.xp}</td>
                                    <td style={tableCellStyle}>{s.lessons}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Charts */}
                    <div style={chartsContainerStyle}>
                        <div style={chartWrapperStyle}>
                            <h4 style={{ marginBottom: 10 }}>Progress Overview</h4>
                            <canvas ref={barRef} style={canvasStyle}></canvas>
                        </div>
                        <div style={chartWrapperStyle}>
                            <h4 style={{ marginBottom: 10 }}>XP Distribution</h4>
                            <canvas ref={pieRef} style={canvasStyle}></canvas>
                        </div>
                    </div>

                    {/* Centered Logout Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                        <button
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 24px',
                                fontSize: '1rem',
                                fontWeight: 500,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onClick={() => {
                                localStorage.removeItem('eduquest-user')
                                navigate('/login')
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
