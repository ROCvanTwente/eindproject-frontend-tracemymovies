import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, RefreshCw } from 'lucide-react';
export function ServerErrorPage() {
    const handleRefresh = () => {
        window.location.reload();
    };
    return (_jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx("div", { className: "mb-8 flex justify-center", children: _jsxs("div", { className: "relative", children: [_jsx(AlertCircle, { className: "w-32 h-32 text-[#FF61D2]/20" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("span", { className: "text-7xl font-bold font-heading text-[#FF61D2]", children: "500" }) })] }) }), _jsx("h1", { className: "text-4xl font-bold font-heading text-[#F8FAFC] mb-4", children: "Server Error" }), _jsx("p", { className: "text-[#94A3B8] text-lg mb-8", children: "Oops! Something went wrong on our end. Please try refreshing the page or come back later." }), _jsxs("button", { onClick: handleRefresh, className: "inline-flex items-center gap-2 bg-[#FF61D2] hover:bg-[#FF4DC7] text-[#F8FAFC] px-6 py-3 rounded-xl font-medium font-heading transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#FF61D2]/40", children: [_jsx(RefreshCw, { className: "w-5 h-5" }), "Try Again"] })] }) }));
}
