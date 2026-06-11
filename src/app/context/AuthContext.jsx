import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    validateToken,
    setStoredUser,
    getStoredUser,
    getToken
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const [isLoading, setIsLoading] = useState(() => !getStoredUser());

    useEffect(() => {
        initAuth();

        return () => {};
    }, []);

    async function initAuth() {
        const existingUser = await validateToken();
        setUser(existingUser);
        setIsLoading(false);
        if (existingUser) startHeartbeat();
    }

    async function login(email, password, remember = false) {
        await loginService({ email, password, remember });
        const fullUser = await validateToken();
        setUser(fullUser);
        startHeartbeat();
    }

async function register(formData) {
    const res = await registerService(formData);

    if (!res.requiresVerification) {
        setUser({
            email: formData.email,
            username: res.username || formData.username,
            id: res.id ?? null,
            token: res.token,
            isAdmin: res.isAdmin ?? false
        });
    }

    return res;
}

    function getAuthToken() {
        return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    }

    function startHeartbeat() {
        // Clear any existing interval
        if (window._heartbeatInterval) clearInterval(window._heartbeatInterval);
        window._heartbeatInterval = setInterval(() => {
            const token = getAuthToken();
            if (!token) return;
            fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/heartbeat`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {});
        }, 60000); // every 60 seconds
    }

    function stopHeartbeat() {
        if (window._heartbeatInterval) {
            clearInterval(window._heartbeatInterval);
            window._heartbeatInterval = null;
        }
    }

    async function logout() {
        const token = getAuthToken();
        if (token) {
            try {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch {}
        }
        stopHeartbeat();
        logoutService();
        setUser(null);
    }

    function updateUser(updates) {
        setUser((prev) => {
            const updated = { ...prev, ...updates };
            const remember = !!localStorage.getItem("auth_token");
            // Sla profilePicture NIET op in localStorage — base64 is te groot en maakt alles traag
            const { profilePicture, ...storableUser } = updated;
            setStoredUser(storableUser, remember);
            return updated;
        });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}