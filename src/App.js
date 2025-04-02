import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import UserDetails from "./components/UserDetails"; // This must exist
import "./App.css"; // Make sure the styles are in App.css

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Firebase Authentication</h1>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/user-details" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
