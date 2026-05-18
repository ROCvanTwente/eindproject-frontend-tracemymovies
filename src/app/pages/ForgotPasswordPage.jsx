import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, Send } from 'lucide-react';
export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password for:', email);
        setSubmitted(true);
    };
    return (_jsx("div", { className: "min-h-[90vh] flex items-center justify-center px-4 py-12", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-8 shadow-2xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-[#44FFFF]/10 rounded-full mb-4", children: _jsx(Mail, { className: "w-8 h-8 text-[#44FFFF]" }) }), _jsx("h1", { className: "text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Reset Your Password" }), _jsx("p", { className: "text-[#94A3B8]", children: submitted
                                    ? 'Check your email for reset instructions'
                                    : 'Enter your email to receive a reset link' })] }), !submitted ? (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-2", children: [_jsx(Mail, { className: "w-4 h-4 inline mr-2" }), "Email"] }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all", placeholder: "your@email.com", required: true })] }), _jsxs("button", { type: "submit", className: "w-full bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#44FFFF]/40 flex items-center justify-center gap-2", children: [_jsx(Send, { className: "w-5 h-5" }), "Send Reset Link"] })] })) : (_jsxs("div", { className: "bg-[#44FFFF]/10 border border-[#44FFFF]/30 rounded-xl p-6 text-center", children: [_jsxs("p", { className: "text-[#F8FAFC] mb-4", children: ["We've sent a password reset link to ", _jsx("strong", { className: "text-[#44FFFF]", children: email })] }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Please check your inbox and follow the instructions to reset your password." })] })), _jsxs(Link, { to: "/login", className: "flex items-center justify-center gap-2 text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors mt-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Login"] })] }) }) }));
}
