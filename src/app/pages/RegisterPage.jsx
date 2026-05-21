import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    Shield,
    AlertCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

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

    const { register } = useAuth();
    const navigate = useNavigate();

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
            await register(formData);

            toast.success('Account created successfully!');

            navigate('/');

        } catch (err) {

            const msg = err.message || 'Registration failed';

            setError(msg);

            if (msg.includes('already exists')) {
                toast.error('Account already exists. Please login.');
                navigate('/login');
            } else {
                toast.error(msg);
            }

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
                        <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6 flex items-center gap-3">

                            <AlertCircle className="w-5 h-5 text-[#FF61D2]" />

                            <p className="text-[#F8FAFC] text-sm">
                                {error}
                            </p>
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

                    {/* LOGIN LINK */}
                    <p className="text-center text-[#94A3B8] mt-6">

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