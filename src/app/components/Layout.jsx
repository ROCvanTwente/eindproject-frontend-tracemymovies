import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ApiKeyBanner } from './ApiKeyBanner';
import { Toaster } from 'sonner';

export function Layout() {
    return (
        <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ApiKeyBanner />
            <Toaster
                position="top-right"
                richColors
                theme="dark"
                offset="72px"
                duration={4000}
                swipeDirections={['right', 'left']}
            />
        </div>
    );
}
