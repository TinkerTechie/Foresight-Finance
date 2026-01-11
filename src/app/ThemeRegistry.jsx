'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material/nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

// A custom theme for your app
const theme = createTheme({
  palette: {
    mode: 'dark', // Using a dark base to match your component's aesthetic
    primary: {
      main: '#10E4A5', // The vibrant green from your design
    },
    background: {
      default: '#0F172A', // The main background color
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h1: {
        fontSize: '2.5rem', // Customizing h1 to match your design
        fontWeight: 700,
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

