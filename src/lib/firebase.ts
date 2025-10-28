// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwS3sxh8gX6SQiLfZz1ehidXbDgCQB3Tc",
  authDomain: "medibridge-bd590.firebaseapp.com",
  projectId: "medibridge-bd590",
  storageBucket: "medibridge-bd590.appspot.com",
  messagingSenderId: "475957265235",
  appId: "1:475957265235:web:3fa1d63b83df72df4157a6",
  measurementId: "G-TSRHCE1NQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
