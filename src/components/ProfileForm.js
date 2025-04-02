import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const navigate = useNavigate();
  const user = auth.currentUser; // Get the logged-in user
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    birthDate: "",
  });

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setFormData(userSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, formData);
      alert("Profile saved successfully!");
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProfileForm;
