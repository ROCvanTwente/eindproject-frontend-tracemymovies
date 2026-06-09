import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId') || '';
    const token = searchParams.get('token') || '';

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        if (!userId || !token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, token }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed. The link may have expired.');
                }
            } catch {
                setStatus('error');
                setMessage('Network error, please try again.');
            }
        };

        verify();
    }, [userId, token]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl text-center">

                    {status === 'loading' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BFBCFC]/10 rounded-full mb-4">
                                <Loader className="w-8 h-8 text-[#BFBCFC] animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Verifying your email...</h1>
                            <p className="text-[#94A3B8]">Just a moment.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#44FFFF]/10 rounded-full mb-4">
                                <CheckCircle className="w-8 h-8 text-[#44FFFF]" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Email verified!</h1>
                            <p className="text-[#94A3B8] mb-6">Your account is now active. You can log in.</p>
                            <Link
                                to="/login"
                                className="inline-block bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-8 py-3 rounded-xl font-bold font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#44FFFF]/40"
                            >
                                Log in →
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                                <XCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Verification failed</h1>
                            <p className="text-[#94A3B8] mb-6">{message}</p>
                            <Link
                                to="/register"
                                className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors"
                            >
                                Back to register →
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
