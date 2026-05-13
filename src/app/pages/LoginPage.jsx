import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
            await login(formData.email, formData.password, formData.remember);
            navigate('/');
        }
        catch (err) {
            setError(err.message || 'Login failed');
            toast.error(err.message || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-[90vh] flex items-center justify-center px-4 py-8 md:py-12", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 md:p-8 shadow-2xl", children: [_jsxs("div", { className: "text-center mb-6 md:mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 bg-[#BFBCFC]/10 rounded-full mb-3 md:mb-4", children: _jsx(LogIn, { className: "w-7 md:w-8 h-7 md:h-8 text-[#BFBCFC]" }) }), _jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-[#94A3B8] text-sm md:text-base", children: "Sign in to continue to TraceMyMovies" })] }), _jsxs("div", { className: "bg-[#44FFFF]/10 border border-[#44FFFF]/30 rounded-xl p-4 mb-6", children: [_jsx("p", { className: "text-[#F8FAFC] text-sm font-medium mb-2", children: "Demo Credentials:" }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Email: demo@tracemymovies.com" }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Email: admin@tracemymovies.com" }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Password: demo123" })] }), error && (_jsxs("div", { className: "bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6 flex items-center gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-[#FF61D2]" }), _jsx("p", { className: "text-[#F8FAFC] text-sm", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-2", children: [_jsx(Mail, { className: "w-4 h-4 inline mr-2" }), "Email"] }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all", placeholder: "your@email.com", required: true, disabled: loading })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-2", children: [_jsx(Lock, { className: "w-4 h-4 inline mr-2" }), "Password"] }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all", placeholder: "Enter your password", required: true, disabled: loading })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "remember", checked: formData.remember, onChange: (e) => setFormData({ ...formData, remember: e.target.checked }), className: "w-4 h-4 rounded border-[#BFBCFC]/30 bg-[#0B0E14] checked:bg-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20", disabled: loading }), _jsx("label", { htmlFor: "remember", className: "text-[#94A3B8] text-sm", children: "Remember me" })] }), _jsx(Link, { to: "/forgot-password", className: "text-[#BFBCFC] hover:text-[#AFA9FF] text-sm font-medium transition-colors", children: "Forgot Password?" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#BFBCFC]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100", children: loading ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0B0E14]" }), "Logging in..."] })) : ('Login') })] }), _jsxs("p", { className: "text-center text-[#94A3B8] mt-6", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-[#BFBCFC] hover:text-[#AFA9FF] font-medium transition-colors", children: "Create Account" })] })] }) }) }));
}
