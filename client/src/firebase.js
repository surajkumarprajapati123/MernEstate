// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estme.firebaseapp.com",
  projectId: "mern-estme",
  storageBucket: "mern-estme.appspot.com",
  messagingSenderId: "60562896578",
  appId: "1:60562896578:web:00499f01e2e70ca7bc6d5b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
