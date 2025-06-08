"use strict";

const CACHE_NAME = 'pwa1';

const urlsToCache = [
    '/index.html',
    '/scripts/model.js',
    '/scripts/view.js',
    '/scripts/presenter.js',
    '/scripts/main.js',
    '/scripts/style.css',
    '/scripts/navigation-bar.css',
    '/scripts/rest.js',
    '/scripts/questions.json',
    '/scripts/categories.json',
    '/manifest.json',
    '/images/logo.png',
    'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/tone@next/build/Tone.js',
    'https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js'
];

self.addEventListener('install', event => event.waitUntil(
    caches.open(CACHE_NAME).then(cache => 
        urlsToCache.forEach(url => 
            cache.add(url).catch(err => console.error(`Failed to cache ${url}:`, err))
        )
    )
));

self.addEventListener('fetch', event => event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(response => {
            if (response) {
                return response; // Return cached response if available
            }
            return fetch(event.request).then(networkResponse => {
                // Cache the new response for future use
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        })
    )
));