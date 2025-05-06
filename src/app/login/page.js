"use client"
import "./style1.css"
import React,{useState} from "react"
export default function Login() {
    const [showLogin,setShowLogin] = useState(false)
    return (
        <>
        <div className="btn">
        <button className="buttn" onClick={() => setShowLogin(true)}>Login First!</button>
       </div>
        {showLogin && <div className="logcont">
            <h3 className="lgbtn">Login to Your Account</h3>
            <input type="email" placeholder="Type your email.." className="inp1"/>
            <input type="password" placeholder="Type your password.." className="inp2"/>
            <button>Login</button>
            </div>}
        </>
    )
}