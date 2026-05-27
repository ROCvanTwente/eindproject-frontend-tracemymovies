import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

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
                        <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-[#FF61D2]" />

                            <p className="text-[#F8FAFC] text-sm">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* TEST ACCOUNT INFO */}
<div className="bg-[#44FFFF]/10 border border-[#44FFFF]/20 rounded-xl p-4 mb-6">
    <h3 className="text-[#44FFFF] font-semibold mb-3 text-sm md:text-base">
        Development Test Account
    </h3>

    <div className="space-y-2 text-sm">

        <p className="text-[#F8FAFC]">
            <span className="text-[#94A3B8]">Email:</span>{' '}
            admin@site.com
        </p>

        <p className="text-[#F8FAFC]">
            <span className="text-[#94A3B8]">Password:</span>{' '}
            Admin123!
        </p>
               <p className="text-[#F8FAFC]">
            <span className="text-[#94A3B8]">Email:</span>{' '}
            team@site.com
        </p>

        <p className="text-[#F8FAFC]">
            <span className="text-[#94A3B8]">Password:</span>{' '}
            Team123!
        </p>
    </div>
</div>

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