import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBYh6ZxJsemr6eCUhE0nnb73wbT7Nooe-g",
    authDomain: "my-app-f3074.firebaseapp.com",
    projectId: "my-app-f3074",
    storageBucket: "my-app-f3074.firebasestorage.app",
    messagingSenderId: "369228369491",
    appId: "1:369228369491:web:32c60200f16abf5e2840a6",
    measurementId: "G-XDW7Z1Z2VQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore Database
const db = getFirestore(app);

export { auth, googleProvider, db };
