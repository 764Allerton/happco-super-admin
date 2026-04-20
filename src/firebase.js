/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp, serverTimestamp, increment } from "firebase/firestore";
import { getMessaging, getToken } from 'firebase/messaging';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCbcCom5SB7wRUnLAfwhPA1-9QNTZXDK7o",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "hmj-happco.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "hmj-happco",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "hmj-happco.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "236360708000",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:236360708000:web:044a9fdfe42e62fb7fbec5",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-HL2H69YMX7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let currentToken ;

// Get Auth and Database instances
const auth = getAuth(app);
// const database = getDatabase(app);
const database = getFirestore(app);
// const messaging = getMessaging();

export { auth, database, analytics, Timestamp, serverTimestamp, increment, currentToken };
export default app;