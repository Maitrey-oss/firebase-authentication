import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./AuthForm.css"; // Import the CSS file

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          uid: user.uid,
        });

        alert("Registration Successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Sign-In Successful!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        firstName: user.displayName.split(" ")[0], // Extract First Name from Google Profile
        lastName: user.displayName.split(" ")[1] || "", // Extract Last Name if available
        email: user.email,
        uid: user.uid,
      }, { merge: true });

      alert("Google Sign-In Successful!");
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
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </>
        )}
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
