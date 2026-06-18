import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Trash2, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Module-level set persists across StrictMode remounts — prevents double-fire
const _called = new Set();

export function ConfirmDeletePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (_called.has(token)) return;
        _called.add(token);

        if (!token) {
            setStatus('error');
            setMessage('Invalid deletion link.');
            return;
        }

        const confirm = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/confirm-delete?token=${encodeURIComponent(token)}`, {
                    method: 'POST',
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    logout();
                    setStatus('success');
                    setTimeout(() => navigate('/'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Deletion failed. The link may have expired.');
                }
            } catch {
                setStatus('error');
                setMessage('Network error, please try again.');
            }
        };

        confirm();
    }, [token]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl text-center">

                    {status === 'loading' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BFBCFC]/10 rounded-full mb-4">
                                <Loader className="w-8 h-8 text-[#BFBCFC] animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Deleting account...</h1>
                            <p className="text-[#94A3B8]">Just a moment.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF61D2]/10 rounded-full mb-4">
                                <Trash2 className="w-8 h-8 text-[#FF61D2]" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Account deleted</h1>
                            <p className="text-[#94A3B8] text-sm mb-6">Your account has been permanently deleted. You will be redirected to the home page.</p>
                            <Link
                                to="/"
                                className="inline-block bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-8 py-3 rounded-xl font-bold font-heading transition-all duration-200 hover:scale-105"
                            >
                                Go home →
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                                <XCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Deletion failed</h1>
                            <p className="text-[#94A3B8] mb-6">{message}</p>
                            <Link
                                to="/profile"
                                className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors"
                            >
                                Back to profile →
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
