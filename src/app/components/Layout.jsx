import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
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
                <Toaster
                    position="top-right"
                    richColors
                    theme="dark"
                    offset="72px"
                    duration={4000}
                    swipeDirections={['right', 'left']}
                />
                <BadgeChecker />
                <BadgeUnlockOverlay />
            </div>
        </BadgeProvider>
    );
}
