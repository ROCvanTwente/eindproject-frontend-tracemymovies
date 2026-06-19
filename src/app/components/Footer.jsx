import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DISCOVER = [
  { label: 'Home',         to: '/',         title: 'TraceMyMovies Home - Track and rate films' },
  { label: 'Browse Films', to: '/movies',    title: 'Browse all films and search movies' },
  { label: 'About Us',     to: '/about',     title: 'About TraceMyMovies and the development team' },
];

const FEATURES_GUEST = [
  { label: 'Track Films',   to: '/register', title: 'Register to track films you watch' },
  { label: 'Rate & Review', to: '/register', title: 'Register to write movie reviews' },
  { label: 'Friends',       to: '/register', title: 'Register to add friends and see activity' },
  { label: 'Badges',        to: '/register', title: 'Register to unlock badges' },
];

const FEATURES_AUTH = [
  { label: 'Track Films',   to: '/watched',  title: 'View your tracked films' },
  { label: 'Rate & Review', to: '/reviews',  title: 'Write and view movie reviews' },
  { label: 'Friends',       to: '/FriendPage', title: 'Connect with movie friends' },
  { label: 'Badges',        to: '/badges',   title: 'Check your unlocked badges' },
];

export function Footer() {
  const { isAuthenticated } = useAuth();
  const accountLinks = isAuthenticated
    ? [
        { label: 'My Profile', to: '/my-profile', title: 'View your public movie profile' },
        { label: 'Settings', to: '/profile',    title: 'Manage your account settings' }
      ]
    : [
        { label: 'Create Account', to: '/register', title: 'Sign up for a free movie tracking account' },
        { label: 'Sign In', to: '/login',       title: 'Sign in to your movie tracker profile' }
      ];
  
  const featureLinks = isAuthenticated ? FEATURES_AUTH : FEATURES_GUEST;

  return (
    <footer className="bg-[#0D1017] border-t border-white/5 mt-12 md:mt-20" aria-label="Site Footer">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">

        {/* Main grid */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4" title="TraceMyMovies Home">
              <img src="/logo.png" alt="TraceMyMovies Logo - Social movie rating & diary platform" className="h-8 w-auto" />
              <span className="font-black text-[#F8FAFC] text-sm">TraceMyMovies</span>
            </Link>
            <p className="text-[#475569] text-xs leading-relaxed">
              TraceMyMovies is a social platform and movie diary for film lovers. Track your watch history, write reviews, rate movies, and share lists with friends.
            </p>
          </div>

          {/* Discover Links */}
          <nav aria-label="Discover links">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">Discover</h3>
            <ul className="space-y-3">
              {DISCOVER.map(({ label, to, title }) => (
                <li key={label}>
                  <Link to={to} title={title} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account & Features Links */}
          <nav aria-label="Account and features links">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">Account</h3>
            <ul className="space-y-3 mb-6">
              {accountLinks.map(({ label, to, title }) => (
                <li key={label}>
                  <Link to={to} title={title} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">Features</h3>
            <ul className="space-y-3">
              {featureLinks.map(({ label, to, title }) => (
                <li key={label}>
                  <Link to={to} title={title} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About + Contact info */}
          <div>
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4">About the Project</h3>
            <p className="text-[#475569] text-xs leading-relaxed mb-3">
              TraceMyMovies is a third-year graduation project built by students at ROC van Twente, inspired by Letterboxd. It is a non-commercial, educational project. No data is commercialized or sold.
            </p>
            <p className="text-[#475569] text-xs leading-relaxed mb-5">
              Film metadata, including titles, posters, and cast, is powered by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#BFBCFC] underline transition-colors" title="The Movie Database (TMDB)">TMDB</a>.
            </p>
            <a
              href="mailto:info@tracemymovies.nl"
              title="Email support"
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
            © 2026 TraceMyMovies. Built with passion for movie fans.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#334155] text-xs">
            <Link to="/about" className="hover:text-[#BFBCFC] transition-colors" title="Terms of Service">Terms</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-[#BFBCFC] transition-colors" title="Privacy Policy">Privacy</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-[#BFBCFC] transition-colors" title="Sitemap">Sitemap</Link>
            <span>·</span>
            <span className="text-[#BFBCFC]/60 font-semibold">Powered by TMDB</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
