const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;
 
const TOKEN_KEY = "auth_token";
 
export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
 
export function setToken(token, remember = true) {
    if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}
 
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}
 
export function decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        // base64url -> base64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
        return null;
    }
}

export function getCurrentUserId() {
    const token = getToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // common claim names
    const candidates = [
        'id', 'userId', 'sub', 'nameid', 'nameidentifier', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ];

    for (const c of candidates) {
        if (payload[c] != null) return payload[c];
        // some tokens use nested claim names
        if (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] != null) return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }

    return null;
}

export async function login({ email, password, remember = false }) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
 
    if (!res.ok) {
        let message = "Invalid email or password";
        try {
            const data = await res.json();
            if (data.message) message = data.message;
        } catch {}
        throw new Error(message);
    }
 
    const data = await res.json();
 
    setToken(data.token, remember);
 
    return data;
}
 
export async function register({
    email,
    password,
    username,
    remember = false
}) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            username
        })
    });
 
    if (!res.ok) {
        let message = "Registration failed";
        try {
            const data = await res.json();
            if (data.message) message = data.message;
        } catch {}
        throw new Error(message);
    }
 
    const data = await res.json();

    if (!data.requiresVerification) {
        setToken(data.token, remember);
    }

    return data;
}
 
export async function validateToken() {
    const token = getToken();
    if (!token) return null;
 
    const payload = decodeJwtPayload(token);
    // Haal de rol uit de token claims (beveiligd door je C# API)
    const role = payload ? (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || "User") : "User";

    try {
        const res = await fetch(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
 
        if (!res.ok) {
            if (res.status === 503) {
                return payload ? {
                    id: payload.sub || payload.nameid || payload.id,
                    userId: payload.sub || payload.nameid || payload.id,
                    username: payload.unique_name || payload.name,
                    email: payload.email,
                    role: role,
                    token: token
                } : null;
            }
            removeToken();
            return null;
        }
 
        const profile = await res.json();
 
        return {
            id: profile.id,
            userId: profile.id,
            username: profile.userName,
            email: profile.email,
            role: role,
            token: token,
            profilePicture: profile.profileImageBase64
                ? `data:image/jpeg;base64,${profile.profileImageBase64}`
                : null,
            location: profile.location ?? null,
            bio: profile.bio ?? null,
            isOnline: profile.isOnline ?? false,
            lastSeen: profile.lastSeen ?? null,
            showFriends: profile.showFriends ?? true,
        };
    } catch {
        return payload ? {
            id: payload.sub || payload.nameid || payload.id,
            userId: payload.sub || payload.nameid || payload.id,
            username: payload.unique_name || payload.name,
            email: payload.email,
            role: role,
            token: token
        } : null;
    }
}
 
export function logout() {
    removeToken();
}