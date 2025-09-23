import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbPromise, STORE_USERS } from '../App'

export default function Login() {
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        if (!username) return setError('Enter username')

        const db = await dbPromise
        const user = await db.get(STORE_USERS, username.trim())
        if (!user) {
            setError('User not found. Try student1, student2, or teacher')
            return
        }
        setError('')
        localStorage.setItem('eduquest-user', JSON.stringify(user))
        if (user.role === 'teacher') navigate('/teacher')
        else navigate('/student')
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>EduQuest Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username (student1, student2, teacher)"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ padding: 10, width: 300 }}
                />
                <br />
                <button type="submit" style={{ marginTop: 10, padding: 10 }}>
                    Login
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
