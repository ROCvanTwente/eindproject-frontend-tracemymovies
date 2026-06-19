import { Outlet, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { BadgeProvider } from '../context/BadgeContext';
import { BadgeChecker } from './BadgeChecker';
import { BadgeUnlockOverlay } from './BadgeUnlockOverlay';
import { useAuth } from '../context/AuthContext';
import { MaintenancePage } from './MaintenancePage';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export function Layout() {
    const { user } = useAuth();
    const location = useLocation();
    const [isMaintenance, setIsMaintenance] = useState(false);

    const checkMaintenance = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${baseUrl}/auth/profile`, { headers });
            if (res.status === 503) {
                setIsMaintenance(true);
            } else {
                setIsMaintenance(false);
            }
        } catch (err) {
            // Keep current state on network/connectivity errors
        }
    };

    useEffect(() => {
        checkMaintenance();

        // Intercept global fetches to capture 503 status code (Maintenance Mode) on the fly
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (response.status === 503) {
                    setIsMaintenance(true);
                }
                return response;
            } catch (error) {
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const isStaff = user?.role === "Admin" || user?.role === "Moderator" || user?.role === "Mod";
    const onLoginPage = location.pathname === "/login";

    if (isMaintenance && !isStaff && !onLoginPage) {
        return (
            <MaintenancePage onRetry={checkMaintenance} />
        );
    }

    return (
        <BadgeProvider>
            <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">
                <ScrollToTop />
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
                <Toaster
                    position="top-right"
                    theme="dark"
                    offset="72px"
                    duration={4000}
                    swipeDirections={['right', 'left']}
                    toastOptions={{
                        classNames: {
                            toast: "!bg-[#151921] !text-[#F8FAFC] !border !border-white/10",
                            success: "!border-[#44FFFF]/30 [&_[data-icon]]:!text-[#44FFFF]",
                            error: "!border-[#FF6B6B]/30 [&_[data-icon]]:!text-[#FF6B6B]",
                            warning: "!border-[#FF61D2]/30 [&_[data-icon]]:!text-[#FF61D2]",
                            info: "!border-[#BFBCFC]/30 [&_[data-icon]]:!text-[#BFBCFC]",
                        },
                    }}
                />
                <BadgeChecker />
                <BadgeUnlockOverlay />
            </div>
        </BadgeProvider>
    );
}
