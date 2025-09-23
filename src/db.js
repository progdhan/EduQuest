import { openDB } from 'idb'

export const DB_NAME = 'eduquest-db'
export const DB_VERSION = 1
export const STORE_USERS = 'users'
export const STORE_PROGRESS = 'progress'

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_USERS)) {
            db.createObjectStore(STORE_USERS, { keyPath: 'username' })
        }
        if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
            db.createObjectStore(STORE_PROGRESS, { keyPath: 'username' })
        }
    }
})
