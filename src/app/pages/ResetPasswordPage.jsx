import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword: password }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Reset failed. The link may have expired.');
            }
        } catch {
            setError('Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Invalid or expired reset link.</p>
                    <Link to="/forgot-password" className="text-[#44FFFF] hover:underline">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#44FFFF]/10 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-[#44FFFF]" />
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-[#F8FAFC] mb-2">New Password</h1>
                        <p className="text-[#94A3B8]">Enter your new password below</p>
                    </div>

                    {success ? (
                        <div className="bg-[#44FFFF]/10 border border-[#44FFFF]/30 rounded-xl p-6 text-center">
                            <CheckCircle className="w-12 h-12 text-[#44FFFF] mx-auto mb-3" />
                            <p className="text-[#F8FAFC] mb-2">Password reset successfully!</p>
                            <p className="text-[#94A3B8] text-sm">Redirecting you to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[#F8FAFC] mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 pr-12 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#F8FAFC] mb-2">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#44FFFF]/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors mt-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
