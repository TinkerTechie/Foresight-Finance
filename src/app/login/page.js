"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./style1.css";

export default function Login() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const emailInput = e.target.email.value;
    setEmail(emailInput);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setShowLogin(false);
  };

  return (
    <div className="btn">
      {!showLogin && !isLoggedIn && (
        <button className="buttn" onClick={() => setShowLogin(true)}>
          Login First!
        </button>
      )}

      {showLogin && !isLoggedIn && (
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
        <div className="after-login">
          <h2 style={{ color: "#fff", marginTop: "2rem" }}>
            Welcome, {email} 🎉
          </h2>
          <button className="btnlog1" onClick={handleLogout}>
            Logout
          </button>
          <Link href="/userinfo">
            <button className="btnlog1">Go to Finance Info</button>
          </Link>
        </div>
      )}
    </div>
  );
}
