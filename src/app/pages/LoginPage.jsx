import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, loginWithToken } = useAuth();
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: tokenResponse.access_token }),
                });
                if (!res.ok) throw new Error('Google login failed');
                const data = await res.json();
                await loginWithToken(data.token, data);
                toast.success('Welcome back!');
                navigate('/');
            } catch {
                toast.error('Google login failed. Try again.');
            }
        },
        onError: () => toast.error('Google login failed. Try again.'),
        flow: 'implicit',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            await login(
                formData.email,
                formData.password,
                formData.remember
            );

            toast.success('Welcome back!');

            navigate('/');
        } catch (err) {
            const msg = err.message || 'Login failed';

            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 md:py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 md:p-8 shadow-2xl">

                    {/* HEADER */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 bg-[#BFBCFC]/10 rounded-full mb-3 md:mb-4">
                            <LogIn className="w-7 md:w-8 h-7 md:h-8 text-[#BFBCFC]" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2">
                            Welcome Back
                        </h1>

                        <p className="text-[#94A3B8] text-sm md:text-base">
                            Sign in to continue to TraceMyMovies
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-[#FF61D2] mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[#F8FAFC] text-sm font-medium">{error}</p>
                                    <p className="text-[#94A3B8] text-xs mt-1">
                                        Check your email and password and try again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* EMAIL */}
                        <div>
                            <label className="block text-[#F8FAFC] mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>

                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })
                                }
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                                placeholder="your@email.com"
                                required
                                maxLength={254}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-[#F8FAFC] mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>

                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                                placeholder="Enter your password"
                                required
                                maxLength={128}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>

                        {/* REMEMBER + FORGOT */}
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={formData.remember}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            remember: e.target.checked
                                        })
                                    }
                                    className="w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#BFBCFC]"
                                    disabled={loading}
                                />

                                <label
                                    htmlFor="remember"
                                    className="text-[#94A3B8] text-sm"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-[#BFBCFC] hover:text-[#AFA9FF] text-sm font-medium transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#BFBCFC]/15"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[#151921] px-3 text-[#94A3B8]">or continue with</span>
                        </div>
                    </div>

                    {/* GOOGLE */}
                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        className="w-full flex items-center justify-center gap-3 bg-[#1E2530] hover:bg-[#252D3A] border border-[#BFBCFC]/15 hover:border-[#BFBCFC]/30 text-[#F8FAFC] px-6 py-3 rounded-xl font-medium transition-all duration-200"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                    </button>

                    {/* REGISTER LINK */}
                    <p className="text-center text-[#94A3B8] mt-6">
                        Don't have an account?{' '}

                        <Link
                            to="/register"
                            className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}