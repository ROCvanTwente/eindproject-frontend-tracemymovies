// Authentication Service
const AUTH_API_URL = '/api/auth'; // Replace with your actual backend URL
// Token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
export function getStoredUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr)
        return null;
    try {
        return JSON.parse(userStr);
    }
    catch {
        return null;
    }
}
export function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
// API calls (Mock implementation - replace with real API)
export async function login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Admin account
    if (credentials.email === 'admin@tracemymovies.com' && credentials.password === 'demo123') {
        const adminUser = {
            id: 999,
            username: 'Admin',
            email: credentials.email,
            isAdmin: true,
        };
        const mockToken = 'mock_jwt_token_admin_' + Date.now();
        // Store token and user
        setToken(mockToken);
        setStoredUser(adminUser);
        return {
            user: adminUser,
            token: mockToken,
        };
    }
    // Regular user account
    if (credentials.email === 'demo@tracemymovies.com' && credentials.password === 'demo123') {
        const mockUser = {
            id: 1,
            username: 'MovieLover2024',
            email: credentials.email,
            isAdmin: false,
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        // Store token and user
        setToken(mockToken);
        setStoredUser(mockUser);
        return {
            user: mockUser,
            token: mockToken,
        };
    }
    // Invalid credentials
    throw new Error('Invalid email or password');
}
export async function register(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation
    if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
    }
    if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    // Create mock user
    const mockUser = {
        id: Math.floor(Math.random() * 10000),
        username: data.username,
        email: data.email,
    };
    const mockToken = 'mock_jwt_token_' + Date.now();
    // Store token and user
    setToken(mockToken);
    setStoredUser(mockUser);
    return {
        user: mockUser,
        token: mockToken,
    };
}
export async function logout() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Clear stored data
    removeToken();
}
export async function resetPassword(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock success
    console.log('Password reset email sent to:', email);
}
export async function updateProfile(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentUser = getStoredUser();
    if (!currentUser) {
        throw new Error('Not authenticated');
    }
    const updatedUser = { ...currentUser, ...data };
    setStoredUser(updatedUser);
    return updatedUser;
}
export async function changePassword(currentPassword, newPassword) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation
    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    // Mock success
    console.log('Password changed successfully');
}
export async function deleteAccount() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Clear all data
    removeToken();
}
// Check if user is authenticated
export function isAuthenticated() {
    return !!getToken();
}
// Validate token (mock - in real app, validate with backend)
export async function validateToken() {
    const token = getToken();
    if (!token)
        return null;
    const user = getStoredUser();
    if (!user)
        return null;
    // In a real app, validate token with backend
    return user;
}
