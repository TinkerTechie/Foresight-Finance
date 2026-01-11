// Polyfill/Mock localStorage for Server-Side Rendering (SSR)
if (typeof window === 'undefined') {
    if (typeof global.localStorage === 'undefined' || typeof global.localStorage.getItem !== 'function') {
        global.localStorage = {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
            key: () => null,
            length: 0
        };
    }
}

import './globals.css';
import { FinanceProvider } from './context/FinanceContext';

export const metadata = {
    title: 'Foresight Finance',
    description: 'Personalized financial forecasting and insights',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <FinanceProvider>
                    {children}
                </FinanceProvider>
            </body>
        </html>
    );
}