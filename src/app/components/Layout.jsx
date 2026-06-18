import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ApiKeyBanner } from './ApiKeyBanner';
import { Toaster } from 'sonner';
import { BadgeProvider } from '../context/BadgeContext';
import { BadgeChecker } from './BadgeChecker';
import { BadgeUnlockOverlay } from './BadgeUnlockOverlay';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export function Layout() {
    return (
        <BadgeProvider>
            <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">
                <ScrollToTop />
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
                <ApiKeyBanner />
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
