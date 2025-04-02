import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./AuthForm.css"; 

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Check if user exists in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If first time login, create user entry
        await setDoc(userRef, { firstName: "", lastName: "", mobileNumber: "", birthDate: "" });
      }

      // Redirect to UserDetails form
      navigate("/user-details");

    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { firstName: "", lastName: "", mobileNumber: "", birthDate: "" });
      }

      navigate("/user-details"); // Redirect after Google login

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleAuth} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="auth-button">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={signInWithGoogle} className="google-button">Sign in with Google</button>
      <p onClick={() => setIsSignUp(!isSignUp)} className="switch-text">
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default AuthForm;
