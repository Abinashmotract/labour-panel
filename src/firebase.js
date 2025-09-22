import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ Your Firebase Web Config (from Firebase Console -> Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyB464KiXFPJu2OY93xhN9-mhDTH8Xfl0ok",
    authDomain: "labour-99e27.firebaseapp.com",
    projectId: "labour-99e27",
    storageBucket: "labour-99e27.firebasestorage.app",
    messagingSenderId: "105624840524",
    appId: "1:105624840524:web:5a21e9af08a9fd8e2147e9",
    measurementId: "G-J80YQGMJ97"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Request permission + get token
export const requestNotificationPermission = async () => {
    try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const token = await getToken(messaging, {
            vapidKey: "BENMQmtICRNBxkHwsJI_NnKB_qU5OH2j6d9zXBenQ_TsVY4yx9LfUaJAPQoNng6BB0C5kR842bGWfCFJS-szxh0",
            serviceWorkerRegistration: registration,
        });
        console.log("FCM Token:", token);
        return token;
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
};

onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
});

export { messaging };

