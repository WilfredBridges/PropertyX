// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "propertyx-e91bb.firebaseapp.com",
  projectId: "propertyx-e91bb",
  storageBucket: "propertyx-e91bb.appspot.com",
  messagingSenderId: "710025815047",
  appId: "1:710025815047:web:d57796f597c1b18dbdb6a2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);