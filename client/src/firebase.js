// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ncym-2a580.firebaseapp.com", 
  // authDomain: "ncym-2024.onrender.com",
  projectId: "ncym-2a580",
  storageBucket: "ncym-2a580.appspot.com",
  messagingSenderId: "805396829790",
  appId: "1:805396829790:web:59f5d3bf6615eef557c6cf",
  measurementId: "G-WWG8XQ0TPM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

