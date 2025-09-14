"use client";

import React, { useState } from 'react';
import "./style1.css"; // Make sure to import the stylesheet

export default function LoginPage() {
  // --- State Management ---
  const [view, setView] = useState('prompt'); 
  const [username, setUsername] = useState("");
  const [error, setError] = useState(""); // State to hold login error messages

  // --- Event Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const usernameInput = e.target.username.value;
    const passwordInput = e.target.password.value;
    
    setError("");

    if (usernameInput === 'aparna_si' && passwordInput === '1234@') {
      setUsername(usernameInput);
      setView('loggedIn');
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setUsername("");
    setError("");
    setView('prompt');
  };

  // --- Main Render Logic ---
  return (
    <div className="btn">
      {/* View 1: Initial Prompt */}
      {view === 'prompt' && (
        <div className="animate-fade-in">
          <button className="buttn" onClick={() => setView('loginForm')}>
            Login First!
          </button>
        </div>
      )}

      {/* View 2: Login Form */}
      {view === 'loginForm' && (
        <div className="animate-fade-in">
          <form className="logcont" onSubmit={handleLoginSubmit}>
            <h3 className="lgbtn">Login to Your Account</h3>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="inp1"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="inp1"
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btnlog">
              Login
            </button>
          </form>
        </div>
      )}

      {/* View 3: Logged In Welcome Screen */}
      {view === 'loggedIn' && (
        <div className="after-login animate-fade-in">
          <h2>
            Welcome, <span className="username-highlight">{username}</span> 🎉
          </h2>
          <p className="subtitle">You can now access your finance information.</p>
          <div className="button-group">
            <a href="/userinfo" className="btnlog1">Go to Finance Info</a>
            <button onClick={handleLogout} className="btnlog1 logout">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

