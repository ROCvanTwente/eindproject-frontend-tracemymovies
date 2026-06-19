import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    validateToken,
    setToken,
    getToken,
    decodeJwtPayload
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Decodeer de token direct bij het laden om de basis user data paraat te hebben
    const getInitialUser = () => {
        const token = getToken();
        if (!token) return null;
        const payload = decodeJwtPayload(token);
        if (!payload) return null;
        
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || "User";
        return {
            id: payload.sub || payload.nameid || payload.id,
            email: payload.email,
            username: payload.unique_name || payload.name,
            role: role,
            token: token
        };
    };

    const [user, setUser] = useState(getInitialUser);
    const [isLoading, setIsLoading] = useState(true);

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
        const payload = decodeJwtPayload(res.token);
        const role = payload ? (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || "User") : "User";
        setUser({
            id: payload?.sub || payload?.nameid || payload?.id || res.id,
            email: formData.email,
            username: res.username || formData.username,
            role: role,
            token: res.token
        });
        startHeartbeat();
    }

    return res;
}

    async function loginWithToken(token) {
        setToken(token, true);
        const fullUser = await validateToken();
        setUser(fullUser);
        startHeartbeat();
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
                loginWithToken,
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