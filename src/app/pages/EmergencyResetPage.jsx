import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { ShieldAlert, Eye, EyeOff, CheckCircle, Clock } from 'lucide-react';

export function EmergencyResetPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Invalid link.</p>
                    <Link to="/forgot-password" className="text-[#44FFFF] hover:underline">Request a new reset link</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/emergency-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Reset failed.');
            }
        } catch {
            setError('Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                            <ShieldAlert className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Secure your account</h1>
                        <p className="text-[#94A3B8] text-sm">Set a new password to regain access to your account.</p>
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-amber-400 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            Link expires in 5 minutes
                        </div>
                    </div>

                    {success ? (
                        <div className="bg-[#44FFFF]/10 border border-[#44FFFF]/30 rounded-xl p-6 text-center">
                            <CheckCircle className="w-12 h-12 text-[#44FFFF] mx-auto mb-3" />
                            <p className="text-[#F8FAFC] mb-2">Password reset successfully!</p>
                            <p className="text-[#94A3B8] text-sm">Redirecting to login...</p>
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
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 pr-12 rounded-xl border border-red-500/20 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]">
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
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-red-500/20 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold font-heading transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/forgot-password" className="text-[#64748B] hover:text-[#94A3B8] text-sm transition-colors">
                            Link expired? Use forgot password →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
