import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ApiKeyBanner } from './ApiKeyBanner';
import { Toaster } from 'sonner';
export function Layout() {
    return (_jsxs("div", { className: "min-h-screen bg-[#0B0E14] text-[#F8FAFC]", children: [_jsx(Header, {}), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(Footer, {}), _jsx(ApiKeyBanner, {}), _jsx(Toaster, { position: "top-right", richColors: true, theme: "dark" })] }));
}
