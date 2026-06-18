import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Something went wrong, please try again.');
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
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#44FFFF]/10 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-[#44FFFF]" />
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-[#F8FAFC] mb-2">Reset Your Password</h1>
                        <p className="text-[#94A3B8]">
                            {submitted
                                ? 'Check your email for reset instructions'
                                : 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[#F8FAFC] mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#44FFFF]/40 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Send className="w-5 h-5" />
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-[#44FFFF]/10 border border-[#44FFFF]/30 rounded-xl p-6 text-center">
                            <CheckCircle className="w-12 h-12 text-[#44FFFF] mx-auto mb-3" />
                            <p className="text-[#F8FAFC] mb-4">
                                We've sent a reset link to <strong className="text-[#44FFFF]">{email}</strong>
                            </p>
                            <p className="text-[#94A3B8] text-sm">
                                Check your inbox and click the link to reset your password.
                            </p>
                        </div>
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
