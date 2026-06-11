import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';

const _called = new Set();

export function ConfirmEmailChangeRequestPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (_called.has(token)) return;
        _called.add(token);

        if (!token) {
            setStatus('error');
            setMessage('Invalid confirmation link.');
            return;
        }

        const confirm = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/confirm-email-change-request?token=${encodeURIComponent(token)}`,
                    { method: 'POST' }
                );
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setMessage(data.message || '');
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Confirmation failed. The link may have expired.');
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
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Confirming request...</h1>
                            <p className="text-[#94A3B8]">Just a moment.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#60A5FA]/10 rounded-full mb-4">
                                <Mail className="w-8 h-8 text-[#60A5FA]" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Request confirmed!</h1>
                            <p className="text-[#94A3B8] text-sm mb-6">
                                We've sent a confirmation link to your <strong className="text-[#F8FAFC]">new email address</strong>.
                                Click that link to complete the change.
                            </p>
                            <Link
                                to="/"
                                className="text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors"
                            >
                                Back to home →
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                                <XCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold font-heading text-[#F8FAFC] mb-2">Confirmation failed</h1>
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
