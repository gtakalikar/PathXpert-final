// This is a basic service worker file
// It will be registered by the application

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  // This is a basic fetch handler
  // In a real application, you would implement caching strategies here
  event.respondWith(fetch(event.request));
}); 