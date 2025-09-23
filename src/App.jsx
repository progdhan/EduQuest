import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import Lesson from './pages/Lesson'
import Quiz from './pages/Quiz'
import TeacherDashboard from './pages/TeacherDashboard'

import { openDB } from 'idb'

export const DB_NAME = 'eduquest-db'
export const DB_VERSION = 1
export const STORE_USERS = 'users'
export const STORE_PROGRESS = 'progress'

export let dbPromise

function App() {
  // Initialize IndexedDB
  useEffect(() => {
    async function initDB() {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_USERS)) {
            db.createObjectStore(STORE_USERS, { keyPath: 'username' })
          }
          if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
            db.createObjectStore(STORE_PROGRESS, { keyPath: 'username' })
          }
        }
      })

      // Insert dummy users & dummy progress on first load
      const db = await dbPromise
      const tx1 = db.transaction(STORE_USERS, 'readwrite')
      const usersStore = tx1.objectStore(STORE_USERS)
      const users = await usersStore.getAll()

      if (users.length === 0) {
        await usersStore.add({ username: 'student1', role: 'student', grade: '6' })
        await usersStore.add({ username: 'student2', role: 'student', grade: '6' })
        await usersStore.add({ username: 'teacher', role: 'teacher' })
      }
      await tx1.done

      const tx2 = db.transaction(STORE_PROGRESS, 'readwrite')
      const progressStore = tx2.objectStore(STORE_PROGRESS)
      const progress = await progressStore.getAll()
      if (progress.length === 0) {
        await progressStore.add({
          username: 'student1',
          xp: 0,
          completedLessons: []
        })
        await progressStore.add({
          username: 'student2',
          xp: 0,
          completedLessons: []
        })
      }
      await tx2.done
    }

    initDB()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
    </Routes>
  )
}

export default App
