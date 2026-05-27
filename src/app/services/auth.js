// const API_URL = "https://tracemymoviesbackend.runasp.net/api/auth";

const API_URL = "https://localhost:7245/api/auth";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

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
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function setStoredUser(user, remember = false) {
    if (remember) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function getStoredUser() {
    const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export async function login({ email, password, remember = false }) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error("Invalid email or password");
    }

    const data = await res.json();

    setToken(data.token, remember);

    setStoredUser({
        email,
        username: data.username || email.split("@")[0],
        id: data.id,
        isAdmin: data.isAdmin || false
    }, remember);

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
        const error = await res.text();

        if (error.includes("DuplicateUserName")) {
            throw new Error("User already exists. Please login instead.");
        }

        throw new Error(error || "Register failed");
    }

    const data = await res.json();

    setToken(data.token, remember);
    setStoredUser({
        email,
        username: data.username || username,
        id: data.id,
        isAdmin: data.isAdmin || false
    }, remember);

    return data;
}

export async function validateToken() {
    const token = getToken();
    if (!token) return null;

    try {
        const res = await fetch(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            removeToken();
            return null;
        }

        const profile = await res.json();
        const stored = getStoredUser() ?? {};

        return {
            ...stored,
            username: profile.userName,
            email: profile.email,
            profilePicture: profile.profileImageBase64
                ? `data:image/jpeg;base64,${profile.profileImageBase64}`
                : null
        };
    } catch {
        return getStoredUser();
    }
}

export function logout() {
    removeToken();
}