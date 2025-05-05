'use client';
export default function RootLayout({ children }) {
return (
<html lang="en">
<head>
<title>Foresight Finance</title>
<meta name="description" content="Personalized financial forecasting and insights" />
</head>
<body style={{ margin: 0, fontFamily: 'Inter, sans-serif', backgroundColor: '#0F172A' }}>
{children}
</body>
</html>
);
}