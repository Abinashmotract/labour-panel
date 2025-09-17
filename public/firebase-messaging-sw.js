// Use Firebase CDN, no imports
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB464KiXFPJu2OY93xhN9-mhDTH8Xfl0ok",
  authDomain: "labour-99e27.firebaseapp.com",
  projectId: "labour-99e27",
  storageBucket: "labour-99e27.firebasestorage.app",
  messagingSenderId: "105624840524",
  appId: "1:105624840524:web:5a21e9af08a9fd8e2147e9",
  measurementId: "G-J80YQGMJ97"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Background Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
