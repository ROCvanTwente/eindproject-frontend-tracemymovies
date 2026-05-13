import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, validateToken, setStoredUser } from '../services/auth';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addNotificationFn, setAddNotificationFn] = useState(null);
    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);
    async function checkAuth() {
        try {
            const validatedUser = await validateToken();
            if (validatedUser) {
                setUser(validatedUser);
            }
            else {
                setUser(null);
            }
        }
        catch (error) {
            console.error('Auth validation error:', error);
            setUser(null);
        }
        finally {
            setIsLoading(false);
        }
    }
    async function login(email, password, remember = false) {
        try {
            const response = await loginService({ email, password, remember });
            setUser(response.user);
            // Add login notification
            if (addNotificationFn) {
                addNotificationFn({
                    type: 'login',
                    title: 'Successfully Logged In',
                    message: `Welcome back, ${response.user.username}!`,
                });
            }
        }
        catch (error) {
            throw error;
        }
    }
    async function register(username, email, password, confirmPassword) {
        try {
            const response = await registerService({ username, email, password, confirmPassword });
            setUser(response.user);
            // Add registration notification
            if (addNotificationFn) {
                addNotificationFn({
                    type: 'login',
                    title: 'Account Created',
                    message: `Welcome to TraceMyMovies, ${response.user.username}!`,
                });
            }
        }
        catch (error) {
            throw error;
        }
    }
    async function logout() {
        const username = user?.username;
        try {
            await logoutService();
            setUser(null);
            // Add logout notification
            if (addNotificationFn && username) {
                addNotificationFn({
                    type: 'logout',
                    title: 'Logged Out',
                    message: `Goodbye, ${username}! See you soon.`,
                });
            }
        }
        catch (error) {
            console.error('Logout error:', error);
            setUser(null);
        }
    }
    function updateUser(updatedUser) {
        setUser(updatedUser);
        setStoredUser(updatedUser);
    }
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        addNotification: (fn) => setAddNotificationFn(() => fn),
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
