import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const lessonContent = {
    title: 'Components of Cell',
    text: `
A cell has several important components:
- Nucleus: Controls cell activities and contains DNA.
- Cytoplasm: Jelly-like substance where cell processes happen.
- Cell membrane: Protects the cell and controls what enters/exits.
- Mitochondria: Produces energy for the cell.
- Ribosomes: Make proteins.

Learn these components carefully!
`
}

export default function Lesson() {
    const navigate = useNavigate()
    const location = useLocation()
    const { subject, module } = location.state || {}
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('eduquest-user'))
        if (!userData || userData.role !== 'student') {
            navigate('/login')
            return
        }
        setUser(userData)
    }, [])

    if (!user || !subject || !module) return null

    return (
        <div style={{ padding: 20 }}>
            <h2>
                {subject} - {module} Module
            </h2>
            <h3>{lessonContent.title}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{lessonContent.text}</pre>

            <button onClick={() => navigate('/quiz', { state: { subject, module, lessonId: 'components-cell' } })}>
                Take Quiz
            </button>

            <button
                onClick={() => {
                    navigate('/student')
                }}
                style={{ marginLeft: 10 }}
            >
                Back to Dashboard
            </button>
        </div>
    )
}
