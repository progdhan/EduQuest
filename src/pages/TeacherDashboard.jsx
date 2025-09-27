import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbPromise, STORE_PROGRESS, STORE_USERS } from '../App';
import Chart from 'chart.js/auto';

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [mounted, setMounted] = useState(false);

    const barRef = useRef(null);
    const pieRef = useRef(null);
    const barChart = useRef(null);
    const pieChart = useRef(null);

    async function loadStudents() {
        try {
            const db = await dbPromise;
            const allUsers = await db.getAll(STORE_USERS);
            const studentUsers = allUsers.filter(u => u.role === 'student');
            const allProgress = await db.getAll(STORE_PROGRESS);

            const merged = studentUsers.map(s => {
                const prog = allProgress.find(p => p.username === s.username) || { xp: 0, completedLessons: [] };
                return {
                    username: s.username,
                    grade: s.grade,
                    xp: prog.xp,
                    lessons: prog.completedLessons.length
                };
            });

            merged.sort((a, b) => b.xp - a.xp);
            setStudents(merged);
        } catch (err) {
            console.error('Error loading students:', err);
        }
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'));
        if (!userData || userData.role !== 'teacher') {
            navigate('/login');
            return;
        }
        setUser(userData);
        loadStudents();

        const handler = () => loadStudents();
        window.addEventListener('progress-updated', handler);

        const timer = setTimeout(() => setMounted(true), 100);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('progress-updated', handler);
            if (barChart.current) barChart.current.destroy();
            if (pieChart.current) pieChart.current.destroy();
        };
    }, [navigate]);

    // Bar Chart
    useEffect(() => {
        if (!barRef.current) return;
        if (barChart.current) barChart.current.destroy();

        const labels = students.map(s => s.username);
        const xpData = students.map(s => s.xp);
        const lessonsData = students.map(s => s.lessons);

        barChart.current = new Chart(barRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'XP', data: xpData, backgroundColor: '#667eea', borderRadius: 8, borderSkipped: false },
                    { label: 'Lessons Completed', data: lessonsData, backgroundColor: '#22c55e', borderRadius: 8, borderSkipped: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(0,0,0,0.8)', titleColor: 'white', bodyColor: 'white', cornerRadius: 8 }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { display: false } }
                }
            }
        });
    }, [students]);

    // Pie Chart
    useEffect(() => {
        if (!pieRef.current) return;
        if (pieChart.current) pieChart.current.destroy();

        const labels = students.map(s => s.username);
        const xpData = students.map(s => s.xp);

        pieChart.current = new Chart(pieRef.current, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        label: 'XP Share',
                        data: xpData,
                        backgroundColor: labels.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 70%)`),
                        borderColor: '#fff',
                        borderWidth: 2,
                        hoverOffset: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }, [students]);

    if (!user) return null;

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
    const headerStyle = { width: '100%', background: 'rgba(40,40,60,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#fff', padding: '18px 0', textAlign: 'center', fontSize: '1.7rem', fontWeight: 600, letterSpacing: '1px', boxShadow: '0 2px 12px rgba(30,30,50,0.12)', position: 'fixed', top: 0, left: 0, zIndex: 2 };
    const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '90px 10px 30px 10px', fontFamily: 'Segoe UI, sans-serif' };
    const cardStyle = { display: mounted ? 'block' : 'none', animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', background: 'rgba(30,30,50,0.45)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255,255,255,0.15)', padding: 36, borderRadius: 28, width: '100%', maxWidth: 1100, color: '#fff', boxSizing: 'border-box', boxShadow: '0 24px 48px rgba(30,30,50,0.35)' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: 30, overflowX: 'auto', fontSize: '1rem' };
    const tableHeaderStyle = { backgroundColor: '#667eea', color: 'white', padding: 12, textAlign: 'left', fontWeight: 500, fontSize: '1.05rem' };
    const tableCellStyle = { padding: 12, borderBottom: '1px solid #555', fontSize: '1rem' };
    const tableRowEvenStyle = { backgroundColor: 'rgba(255,255,255,0.05)' };
    const tableRowOddStyle = { backgroundColor: 'rgba(255,255,255,0.1)' };

    const chartsContainerStyle = { display: 'flex', gap: 20, justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' };
    const chartWrapperStyle = { flex: '1 1 350px', minWidth: 280, maxWidth: 520, height: 340, background: 'rgba(255,255,255,0.13)', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px rgba(102,126,234,0.10)', overflow: 'hidden' };
    const canvasStyle = { width: '100%', height: '100%', minHeight: 220, maxHeight: 320 };

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
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatShape {
                    0% {transform: translateY(0) scale(1);}
                    30% {transform: translateY(-30px) scale(1.05);}
                    60% {transform: translateY(10px) scale(0.98);}
                    100% {transform: translateY(0) scale(1);}
                }
                @media (max-width: 900px) {
                    .charts-container { flex-direction: column; gap: 28px; }
                    .chart-wrapper { max-width: 100% !important; min-width: 0 !important; height: 320px !important; }
                }
                @media (max-width: 600px) {
                    .dashboard-card { padding: 12px !important; }
                    .charts-container { gap: 18px; }
                    .chart-wrapper { padding: 8px !important; height: 220px !important; }
                    table { font-size: 0.92rem !important; }
                }
                table { overflow-x: auto; display: block; }
                th, td { white-space: nowrap; }
                button.logout-btn:hover:not(:disabled) { background-color: #dc2626 !important; }
                button.logout-btn:active:not(:disabled) { background-color: #b91c1c !important; }
            `}</style>

            <div style={headerStyle}>Vectus Teacher Dashboard</div>
            <div style={containerStyle}>
                <div style={{ ...cardStyle }} className="dashboard-card">
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 20, letterSpacing: '1px', textAlign: 'center' }}>Welcome, {user.username}</h2>

                    {/* Table */}
                    <div style={{ overflowX: 'auto', marginBottom: 30 }}>
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
                                    <tr key={s.username} style={i % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
                                        <td style={tableCellStyle}>{s.username}</td>
                                        <td style={tableCellStyle}>{s.grade}</td>
                                        <td style={tableCellStyle}>{s.xp}</td>
                                        <td style={tableCellStyle}>{s.lessons}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Charts */}
                    <div style={chartsContainerStyle} className="charts-container">
                        <div style={{ ...chartWrapperStyle }} className="chart-wrapper">
                            <h4 style={{ marginBottom: 10, fontWeight: 500, letterSpacing: '0.5px' }}>Progress Overview</h4>
                            <div style={{ flex: 1, minHeight: 180, maxHeight: 320 }}>
                                <canvas ref={barRef} style={canvasStyle}></canvas>
                            </div>
                        </div>
                        <div style={{ ...chartWrapperStyle }} className="chart-wrapper">
                            <h4 style={{ marginBottom: 10, fontWeight: 500, letterSpacing: '0.5px' }}>XP Distribution</h4>
                            <div style={{ flex: 1, minHeight: 180, maxHeight: 320 }}>
                                <canvas ref={pieRef} style={canvasStyle}></canvas>
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
                        <button
                            className="logout-btn"
                            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: '1.08rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.13)', letterSpacing: '0.5px', transition: 'background 0.2s' }}
                            onClick={() => { localStorage.removeItem('eduquest-user'); navigate('/login'); }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
