import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, ExternalLink, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isUsingMockData } from '../services/tmdb';
export function ApiKeyBanner() {
    const [dismissed, setDismissed] = useState(false);
    useEffect(() => {
        // Check localStorage for dismissed state
        const isDismissed = localStorage.getItem('apiKeyBannerDismissed') === 'true';
        setDismissed(isDismissed);
    }, []);
    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('apiKeyBannerDismissed', 'true');
    };
    // Only show if using mock data and not dismissed
    if (!isUsingMockData || dismissed)
        return null;
    return (_jsx("div", { className: "fixed bottom-4 right-4 max-w-md z-50 animate-in slide-in-from-bottom-5", children: _jsx("div", { className: "bg-[#FF61D2]/10 backdrop-blur-xl border border-[#FF61D2]/30 rounded-xl p-4 shadow-2xl", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-[#FF61D2] flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-[#F8FAFC] font-heading font-bold mb-1", children: "TMDB API Key Not Configured" }), _jsx("p", { className: "text-[#94A3B8] text-sm mb-3", children: "The app is using mock data. Configure your TMDB API key to get real movie data." }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("a", { href: "https://www.themoviedb.org/settings/api", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 bg-[#FF61D2] hover:bg-[#FF4DC7] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all", children: ["Get API Key", _jsx(ExternalLink, { className: "w-3 h-3" })] }), _jsx("button", { onClick: handleDismiss, className: "text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium transition-colors", children: "Dismiss" })] })] }), _jsx("button", { onClick: handleDismiss, className: "text-[#94A3B8] hover:text-[#F8FAFC] transition-colors", children: _jsx(X, { className: "w-4 h-4" }) })] }) }) }));
}
