// Safe LocalStorage wrapper to prevent SSR and environment errors

const isBrowser = typeof window !== 'undefined';

export const storage = {
    get: (key, defaultValue = null) => {
        if (!isBrowser) return defaultValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Storage get error:', e);
            return defaultValue;
        }
    },
    set: (key, value) => {
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage set error:', e);
        }
    },
    remove: (key) => {
        if (!isBrowser) return;
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.warn('Storage remove error:', e);
        }
    }
};
