import React, { useState } from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/user-details"); // Redirect to user details page
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/user-details");
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
