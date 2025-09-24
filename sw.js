const CACHE_NAME = 'eduquest-cache-v1'
const urlsToCache = [
    '/',
    '/index.html',
    '/src/main.jsx',
    '/src/App.jsx',
    '/src/pages/Login.jsx',
    '/src/pages/StudentDashboard.jsx',
    '/src/pages/Lesson.jsx',
    '/src/pages/Quiz.jsx',
    '/src/pages/TeacherDashboard.jsx',
    // Add other assets like CSS, images, JS bundles as needed
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
        })
    )
})
