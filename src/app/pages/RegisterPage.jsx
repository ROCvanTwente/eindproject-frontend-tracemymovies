import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle } from 'lucide-react';
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
    setError("");

    if (!formData.captcha) {
        setError("Please complete the CAPTCHA");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    try {
        await register(formData);
        
        toast.success("Account created successfully!");
        
        navigate("/"); // ✅ FIX: redirect home
    } 
    catch (err) {
        const msg = err.message || "Registration failed";

        setError(msg);

        // 👇 nicer UX
        if (msg.includes("already exists")) {
            toast.error("Account already exists. Please login.");
            navigate("/login");
        } else {
            toast.error(msg);
        }
    } 
    finally {
        setLoading(false);
    }
};

    return (
        _jsx("div", {
            className: "min-h-[90vh] flex items-center justify-center px-4 py-8 md:py-12",
            children: _jsx("div", {
                className: "w-full max-w-md",
                children: _jsxs("div", {
                    className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-2xl p-6 md:p-8 shadow-2xl",
                    children: [

                        _jsxs("div", {
                            className: "text-center mb-6 md:mb-8",
                            children: [
                                _jsx("div", {
                                    className: "inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 bg-[#BFBCFC]/10 rounded-full mb-3 md:mb-4",
                                    children: _jsx(UserPlus, {
                                        className: "w-7 md:w-8 h-7 md:h-8 text-[#BFBCFC]"
                                    })
                                }),

                                _jsx("h1", {
                                    className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-2",
                                    children: "Create an Account"
                                }),

                                _jsx("p", {
                                    className: "text-[#94A3B8] text-sm md:text-base",
                                    children: "Join TraceMyMovies today"
                                })
                            ]
                        }),

                        error && _jsxs("div", {
                            className: "bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-xl p-4 mb-6 flex items-center gap-3",
                            children: [
                                _jsx(AlertCircle, {
                                    className: "w-5 h-5 text-[#FF61D2]"
                                }),
                                _jsx("p", {
                                    className: "text-[#F8FAFC] text-sm",
                                    children: error
                                })
                            ]
                        }),

                        _jsxs("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-6",
                            children: [

                                _jsxs("div", {
                                    children: [
                                        _jsxs("label", {
                                            className: "block text-[#F8FAFC] mb-2",
                                            children: [
                                                _jsx(User, { className: "w-4 h-4 inline mr-2" }),
                                                "Username"
                                            ]
                                        }),
                                        _jsx("input", {
                                            type: "text",
                                            value: formData.username,
                                            onChange: (e) =>
                                                setFormData({ ...formData, username: e.target.value }),
                                            className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]",
                                            placeholder: "Your username",
                                            required: true,
                                            disabled: loading
                                        })
                                    ]
                                }),

                                _jsxs("div", {
                                    children: [
                                        _jsxs("label", {
                                            className: "block text-[#F8FAFC] mb-2",
                                            children: [
                                                _jsx(Mail, { className: "w-4 h-4 inline mr-2" }),
                                                "Email"
                                            ]
                                        }),
                                        _jsx("input", {
                                            type: "email",
                                            value: formData.email,
                                            onChange: (e) =>
                                                setFormData({ ...formData, email: e.target.value }),
                                            className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]",
                                            placeholder: "your@email.com",
                                            required: true,
                                            disabled: loading
                                        })
                                    ]
                                }),

                                _jsxs("div", {
                                    children: [
                                        _jsxs("label", {
                                            className: "block text-[#F8FAFC] mb-2",
                                            children: [
                                                _jsx(Lock, { className: "w-4 h-4 inline mr-2" }),
                                                "Password"
                                            ]
                                        }),
                                        _jsx("input", {
                                            type: "password",
                                            value: formData.password,
                                            onChange: (e) =>
                                                setFormData({ ...formData, password: e.target.value }),
                                            className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]",
                                            placeholder: "Create a password",
                                            required: true,
                                            disabled: loading
                                        })
                                    ]
                                }),

                                _jsxs("div", {
                                    children: [
                                        _jsxs("label", {
                                            className: "block text-[#F8FAFC] mb-2",
                                            children: [
                                                _jsx(Lock, { className: "w-4 h-4 inline mr-2" }),
                                                "Confirm Password"
                                            ]
                                        }),
                                        _jsx("input", {
                                            type: "password",
                                            value: formData.confirmPassword,
                                            onChange: (e) =>
                                                setFormData({ ...formData, confirmPassword: e.target.value }),
                                            className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-4 py-3 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC]",
                                            placeholder: "Repeat your password",
                                            required: true,
                                            disabled: loading
                                        })
                                    ]
                                }),

                                _jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        _jsx("input", {
                                            type: "checkbox",
                                            checked: formData.captcha,
                                            onChange: (e) =>
                                                setFormData({ ...formData, captcha: e.target.checked }),
                                            disabled: loading
                                        }),
                                        _jsxs("label", {
                                            className: "text-[#94A3B8]",
                                            children: [
                                                _jsx(Shield, { className: "w-4 h-4 text-[#44FFFF]" }),
                                                " I'm not a robot"
                                            ]
                                        })
                                    ]
                                }),

                                _jsx("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "w-full bg-[#BFBCFC] text-[#0B0E14] py-3 rounded-xl font-medium",
                                    children: loading ? "Creating..." : "Register"
                                })

                            ]
                        }),

                        _jsx("p", {
                            className: "text-center text-[#94A3B8] mt-6",
                            children: _jsxs(_Fragment, {
                                children: [
                                    "Already have an account? ",
                                    _jsx(Link, {
                                        to: "/login",
                                        className: "text-[#BFBCFC]",
                                        children: "Login"
                                    })
                                ]
                            })
                        })

                    ]
                })
            })
        })
    );
}