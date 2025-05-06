"use client";
import React, { useState, useEffect } from "react";
import "./style1.css";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const emailInput = e.target.email.value;
    setIsLoggedIn(true);
    setEmail(emailInput);
    localStorage.setItem("userEmail", emailInput);
  };

  return (
    <div className="btn">
      {!isLoggedIn && !showLogin && (
        <button className="buttn" onClick={() => setShowLogin(true)}>
          Login First!
        </button>
      )}

      {!isLoggedIn && showLogin && (
        <div className="log1">
          <form className="logcont" onSubmit={handleLogin}>
            <h3 className="lgbtn">Login to Your Account</h3>
            <input
              type="email"
              name="email"
              placeholder="Type your email.."
              className="inp1"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Type your password.."
              className="inp1"
              required
            />
            <button type="submit" className="btnlog">
              Login
            </button>
          </form>
        </div>
      )}

      {isLoggedIn && (
        <div className="log1">
          <h2 style={{ color: "#fff" }}>Welcome, {email} 🎉</h2>
          <button
            className="btnlog"
            onClick={() => {
              localStorage.removeItem("userEmail");
              setIsLoggedIn(false);
              setEmail("");
              setShowLogin(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
