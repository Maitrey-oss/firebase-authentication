import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css"; 

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        // Sign up new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", userCredential.user.uid);
        
        // Store first name and last name in Firestore
        await setDoc(userRef, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber: "",
          birthDate: ""
        });

      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/user-details"); // Redirect to form

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleAuth} className="auth-form">
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="auth-button">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="switch-text">
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default AuthForm;
