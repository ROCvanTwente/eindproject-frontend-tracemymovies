import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    validateToken
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initAuth();
    }, []);

    async function initAuth() {
        const existingUser = await validateToken();
        setUser(existingUser);
        setIsLoading(false);
    }

    // LOGIN
    async function login(email, password, remember = false) {
        const res = await loginService({ email, password, remember });

        setUser({
            email,
            username: res.username || res.userName || email.split("@")[0],
            token: res.token,
            id: res.id,
            isAdmin: res.isAdmin || false
        });
    }

async function register(formData) {
    try {
        const response = await registerService(formData);

        setUser(response.user);

    } catch (error) {
        throw error;
    }
}

    // LOGOUT
    function logout() {
        logoutService();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout
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