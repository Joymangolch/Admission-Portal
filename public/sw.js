// Empty service worker to silence 404 errors.
// This is used because some libraries or browsers might try to register a default service worker.
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    // Clean up or simple activation
});
