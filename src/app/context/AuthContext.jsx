import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    validateToken,
    setStoredUser,
    getToken
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

    async function login(email, password, remember = false) {
        await loginService({ email, password, remember });
        // validateToken haalt het volledige profiel op inclusief profielfoto
        const fullUser = await validateToken();
        setUser(fullUser);
    }

async function register(formData) {
    const res = await registerService(formData);

    setUser({
        email: formData.email,
        username: res.username || formData.username,
        id: res.id ?? null,
        token: res.token,
        isAdmin: res.isAdmin ?? false
    });

    return res;
}

    function logout() {
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