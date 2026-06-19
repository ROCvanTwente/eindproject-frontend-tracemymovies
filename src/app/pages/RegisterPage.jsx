import React, { useState, useEffect, useRef } from 'react';

const RESEND_COOLDOWN = 30;
import { Link, useNavigate } from 'react-router';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    Shield,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export function RegisterPage() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        captcha: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearInterval(timerRef.current), []);

    const startCooldown = () => {
        setCooldown(RESEND_COOLDOWN);
        timerRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        if (cooldown > 0 || resendLoading) return;
        setResendLoading(true);
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            startCooldown();
        } catch {}
        finally { setResendLoading(false); }
    };

    const { register, loginWithToken } = useAuth();
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: tokenResponse.access_token }),
                });
                if (!res.ok) throw new Error('Google sign-up failed');
                const data = await res.json();
                await loginWithToken(data.token, data);
                toast.success('Account created! Welcome to TraceMyMovies!');
                navigate('/');
            } catch {
                toast.error('Google sign-up failed. Try again.');
            }
        },
        onError: () => toast.error('Google sign-up failed. Try again.'),
        flow: 'implicit',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        // CAPTCHA
        if (!formData.captcha) {
            setError('Please confirm you are not a robot');
            return;
        }

        // PASSWORD MATCH
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // USERNAME VALIDATION
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!usernameRegex.test(formData.username)) {
            setError(
                'Username must be 3-20 characters and only contain letters, numbers and underscores'
            );
            return;
        }

        // PASSWORD VALIDATION
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{9,}$/;

        if (!passwordRegex.test(formData.password)) {
            setError(
                'Password must contain uppercase, lowercase, number, special character and minimum 9 characters'
            );
            return;
        }

        setLoading(true);

        try {
            const res = await register(formData);

            if (res.requiresVerification) {
                setEmailSent(true);
                startCooldown();
            } else {
                toast.success('Account created successfully!');
                navigate('/');
            }

        } catch (err) {
            const msg = err.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#44FFFF]/10 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-[#44FFFF]" />
                        </div>
                        <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Check your email</h1>
                        <p className="text-[#94A3B8] mb-6 leading-relaxed">
                            We sent a verification link to <strong className="text-[#44FFFF]">{formData.email}</strong>.<br />
                            Click the button in the email to activate your account.
                        </p>
                        <div className="bg-[#44FFFF]/5 border border-[#44FFFF]/20 rounded-xl p-4 mb-4">
                            <CheckCircle className="w-5 h-5 text-[#44FFFF] inline mr-2" />
                            <span className="text-[#94A3B8] text-sm">The link expires in 24 hours</span>
                        </div>

                        <button
                            onClick={handleResend}
                            disabled={cooldown > 0 || resendLoading}
                            className="text-[#BFBCFC] hover:text-[#AFA9FF] text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto mb-4"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            {cooldown > 0 ? `Resend in ${cooldown}s` : resendLoading ? 'Sending...' : 'Resend Email'}
                        </button>

                        <Link to="/login" className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors text-sm">
                            Already verified? Log in →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 md:py-12">

            <div className="w-full max-w-md">

                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 md:p-8 shadow-2xl">

                    {/* HEADER */}
                    <div className="text-center mb-6 md:mb-8">

                        <div className="inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 bg-[#BFBCFC]/10 rounded-full mb-3 md:mb-4">
                            <UserPlus className="w-7 md:w-8 h-7 md:h-8 text-[#BFBCFC]" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2">
                            Create an Account
                        </h1>

                        <p className="text-[#94A3B8] text-sm md:text-base">
                            Join TraceMyMovies today
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-[#FF61D2] mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[#F8FAFC] text-sm font-medium">{error}</p>
                                    {(error.toLowerCase().includes('email already exists') || error.toLowerCase().includes('username already exists')) && (
                                        <Link
                                            to="/login"
                                            className="text-[#BFBCFC] hover:text-[#AFA9FF] text-sm underline underline-offset-2 mt-1 inline-block transition-colors"
                                        >
                                            Already have an account? Login here
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* USERNAME */}
                        <div>

                            <label className="block text-[#F8FAFC] mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Username
                            </label>

                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value
                                    })
                                }
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
                                placeholder="Your username"
                                required
                                minLength={3}
                                maxLength={20}
                                pattern="^[a-zA-Z0-9_]+$"
                                title="Only letters, numbers and underscores allowed"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </div>

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
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
                                placeholder="your@email.com"
                                required
                                maxLength={100}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

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
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
                                placeholder="Create a password"
                                required
                                minLength={9}
                                maxLength={100}
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{9,}$"
                                title="Minimum 9 characters with uppercase, lowercase, number and special character"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </div>

                        <div>

                            <label className="block text-[#F8FAFC] mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value
                                    })
                                }
                                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
                                placeholder="Repeat your password"
                                required
                                minLength={9}
                                maxLength={100}
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </div>

{/* CAPTCHA */}
<div className="flex items-center gap-3">

    <input
        type="checkbox"
        checked={formData.captcha}
        onChange={(e) =>
            setFormData({
                ...formData,
                captcha: e.target.checked
            })
        }
        required
        disabled={loading}
        className="w-4 h-4"
    />

    <label className="text-[#94A3B8] flex items-center gap-2">

        <Shield className="w-4 h-4 text-[#44FFFF]" />
        I'm not a robot <span className="text-red-400">*</span>

    </label>
</div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? 'Creating...' : 'Register'}
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
                        className="w-full flex items-center justify-center gap-3 bg-[#1E2530] hover:bg-[#252D3A] border border-[#BFBCFC]/15 hover:border-[#BFBCFC]/30 text-[#F8FAFC] px-6 py-3 rounded-xl font-medium transition-all duration-200 mb-6"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                    </button>

                    {/* LOGIN LINK */}
                    <p className="text-center text-[#94A3B8]">
                        Already have an account?{' '}

                        <Link
                            to="/login"
                            className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}