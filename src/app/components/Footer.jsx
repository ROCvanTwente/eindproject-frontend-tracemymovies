import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DISCOVER = [
  { label: 'Home',         to: '/' },
  { label: 'Browse Films', to: '/movies' },
  { label: 'About Us',     to: '/about' },
];

const FEATURES_GUEST = [
  { label: 'Track Films',   to: '/register' },
  { label: 'Rate & Review', to: '/register' },
  { label: 'Friends',       to: '/register' },
  { label: 'Badges',        to: '/register' },
];

const FEATURES_AUTH = [
  { label: 'Track Films',   to: '/watched' },
  { label: 'Rate & Review', to: '/reviews' },
  { label: 'Friends',       to: '/FriendPage' },
  { label: 'Badges',        to: '/badges' },
];

export function Footer() {
  const { isAuthenticated } = useAuth();
  const accountLinks = isAuthenticated
    ? [{ label: 'My Profile', to: '/my-profile' }, { label: 'Settings', to: '/profile' }]
    : [{ label: 'Create Account', to: '/register' }, { label: 'Sign In', to: '/login' }];
  const featureLinks = isAuthenticated ? FEATURES_AUTH : FEATURES_GUEST;

  return (
    <footer className="bg-[#0D1017] border-t border-white/5 mt-12 md:mt-20">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">

        {/* Main grid */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="TraceMyMovies" className="h-8 w-auto" />
              <span className="font-black text-[#F8FAFC] text-sm">TraceMyMovies</span>
            </Link>
            <p className="text-[#475569] text-xs leading-relaxed">
              Your personal cinema companion. Track, rate, and share the films you love.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">Discover</h4>
            <ul className="space-y-3">
              {DISCOVER.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">Account</h4>
            <ul className="space-y-3">
              {accountLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4 mt-8">Features</h4>
            <ul className="space-y-3">
              {featureLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TMDB notice + contact */}
          <div>
            <h4 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">About</h4>
            <p className="text-[#475569] text-xs leading-relaxed mb-3">
              TraceMyMovies is a third-year graduation project built by students at ROC van Twente. It is not a real commercial service — no data is sold, no payments are processed.
            </p>
            <p className="text-[#475569] text-xs leading-relaxed mb-5">
              Film data is provided by TMDB. This product is not endorsed or certified by TMDB.
            </p>
            <a
              href="mailto:info@tracemymovies.nl"
              className="inline-flex items-center gap-2 text-[#475569] hover:text-[#BFBCFC] text-xs transition-colors duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              info@tracemymovies.nl
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#334155] text-xs">
            © 2026 TraceMyMovies. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[#334155] text-xs">
            <span>Powered by</span>
            <span className="text-[#BFBCFC]/60 font-semibold ml-1">TMDB</span>
            <span className="mx-2">·</span>
            <Link to="/about" className="hover:text-[#BFBCFC] transition-colors">About the project</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
