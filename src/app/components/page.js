import React from "react";

export default function HomePage() {
return (
<div
style={{
minHeight: "100vh",
backgroundColor: "#0F172A",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
padding: "2rem",
}}
>
<div
style={{
backgroundColor: "rgba(255, 255, 255, 0.05)",
backdropFilter: "blur(14px)",
borderRadius: "20px",
padding: "2rem",
boxShadow: "0 8px 32px rgba(16, 228, 165, 0.15)",
maxWidth: "600px",
textAlign: "center",
}}
>
<h1
style={{
color: "#10E4A5",
fontFamily: "Space Grotesk, sans-serif",
fontSize: "2.5rem",
marginBottom: "1rem",
}}
>
Foresight Finance
</h1>
<p
style={{
color: "#E0FFF4",
fontSize: "1.125rem",
lineHeight: "1.6",
}}
>
A sleek and user-friendly interface that emphasizes budgeting, forecasting, and expense tracking. Get smart insights into your financial future.
</p>
</div>
</div>
);
}