import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./UserDetails.css"; // Keep the styling

const UserDetails = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    birthDate: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Allow first-time users to enter data
  const [isFirstTime, setIsFirstTime] = useState(true); // Track first-time login

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setIsFirstTime(false); // User has logged in before
          setIsEditing(false); // Disable editing until they click "Edit"
        }

        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Allow only numbers for mobile input
    if (name === "mobileNumber") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setUserData({ ...userData, [name]: sanitizedValue });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, userData);
      setIsSaved(true);
      setIsEditing(false);
      setIsFirstTime(false); // Mark user as returning
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="user-details-container">
      <h2>User Details</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="First Name" disabled={!isEditing} />
          <input type="text" name="middleName" value={userData.middleName} onChange={handleChange} placeholder="Middle Name" disabled={!isEditing} />
          <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Last Name" disabled={!isEditing} />
          
          <input 
            type="tel" 
            name="mobileNumber" 
            value={userData.mobileNumber} 
            onChange={handleChange} 
            placeholder="Mobile Number" 
            pattern="[0-9]{10}" 
            maxLength="10"
            disabled={!isEditing}
          />

          <input type="date" name="birthDate" value={userData.birthDate} onChange={handleChange} disabled={!isEditing} />

          {isFirstTime ? (
            <button onClick={handleSave} className="save-button">Save</button>
          ) : (
            <>
              {isEditing ? (
                <button onClick={handleSave} className="save-button">Save</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              )}
            </>
          )}

          {isSaved && <p className="success-message">✅ Details saved successfully!</p>}
        </>
      )}
    </div>
  );
};

export default UserDetails;
