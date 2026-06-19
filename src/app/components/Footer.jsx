import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const DISCOVER = [
  { label: 'Home',          to: '/',         title: 'TraceMyMovies Home - Track and rate films' },
  { label: 'Movie Catalog', to: '/movies',    title: 'Browse our full catalog of films' },
  { label: 'About Us',      to: '/about',     title: 'About TraceMyMovies and the development team' },
];

const FEATURES_GUEST = [
  { label: 'Track Films',   to: '/register', title: 'Register to track films you watch' },
  { label: 'Rate & Review', to: '/register', title: 'Register to write movie reviews' },
  { label: 'Watchlist',     to: '/register', title: 'Register to maintain a watchlist' },
  { label: 'The Queue',     to: '/register', title: 'Register to keep a movie queue' },
  { label: 'Movie Diary',   to: '/register', title: 'Register to keep a diary of your watch history' },
  { label: 'Custom Lists',  to: '/register', title: 'Register to create movie lists' },
  { label: 'Activity Logs', to: '/register', title: 'Register to view user activity logs' },
  { label: 'Friends',       to: '/register', title: 'Register to add friends and see activity' },
  { label: 'Badges',        to: '/register', title: 'Register to unlock badges' },
];

const FEATURES_AUTH = [
  { label: 'Track Films',   to: '/watched',  title: 'View your tracked films' },
  { label: 'Rate & Review', to: '/reviews',  title: 'Write and view movie reviews' },
  { label: 'Watchlist',     to: '/watchlist', title: 'Manage your movie watchlist' },
  { label: 'The Queue',     to: '/the-queue', title: 'Manage your personal queue' },
  { label: 'Movie Diary',   to: '/diary',     title: 'Keep a diary of your movie viewings' },
  { label: 'My Lists',      to: '/my-lists',  title: 'Create and browse custom movie lists' },
  { label: 'Activity Logs', to: '/activity',  title: 'View platform activity logs' },
  { label: 'Friends',       to: '/FriendPage', title: 'Connect with movie friends' },
  { label: 'Badges',        to: '/badges',   title: 'Check your unlocked badges' },
];

export function Footer() {
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');

  const accountLinks = isAuthenticated
    ? [
        { label: 'My Profile', to: '/my-profile', title: 'View your public movie profile' },
        { label: 'Messages', to: '/messages', title: 'Check your direct messages' },
        { label: 'Analytics', to: '/analytics', title: 'Check your movie analytics' },
        { label: 'Settings', to: '/profile',    title: 'Manage your account settings' },
        ...((user?.role === 'Admin' || user?.role === 'Moderator')
          ? [{ label: 'Admin Panel', to: '/admin', title: 'Access settings and moderation dashboards' }]
          : [])
      ]
    : [
        { label: 'Create Account', to: '/register', title: 'Sign up for a free movie tracking account' },
        { label: 'Sign In', to: '/login',       title: 'Sign in to your movie tracker profile' }
      ];
  
  const featureLinks = isAuthenticated ? FEATURES_AUTH : FEATURES_GUEST;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success(`Thank you for subscribing to our newsletter!`);
    setEmail('');
  };

  return (
    <footer className="bg-[#0D1017] border-t border-white/5 mt-12 md:mt-20" aria-label="Site Footer">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">

        {/* Top Newsletter & Socials Row */}
        <div className="py-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-[#F8FAFC] font-bold text-sm mb-1">Stay in the Loop</h3>
            <p className="text-[#475569] text-xs">Get weekly film recommendations, newsletter updates, and new platform feature announcements.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2.5 w-full md:w-auto max-w-md">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              className="bg-[#151921] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#BFBCFC]/40 transition-all w-full"
            />
            <button type="submit" className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0D1017] font-semibold text-xs rounded-xl px-5 py-2.5 transition-all whitespace-nowrap shadow-lg shadow-[#BFBCFC]/5">
              Subscribe
            </button>
          </form>
        </div>

        {/* Main grid */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4" title="TraceMyMovies Home">
              <img src="/logo.png" alt="TraceMyMovies Logo - Social movie rating & diary platform" className="h-8 w-auto" />
              <span className="font-black text-[#F8FAFC] text-sm">TraceMyMovies</span>
            </Link>
            <p className="text-[#475569] text-xs leading-relaxed mb-6">
              TraceMyMovies is a social platform and movie diary for film lovers. Track your watch history, write reviews, rate movies, and share lists with friends.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#BFBCFC]/15 text-[#475569] hover:text-[#BFBCFC] rounded-xl transition-all" title="Follow us on Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#BFBCFC]/15 text-[#475569] hover:text-[#BFBCFC] rounded-xl transition-all" title="Follow us on Instagram">
                <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-[#BFBCFC]/15 text-[#475569] hover:text-[#BFBCFC] rounded-xl transition-all" title="Follow us on GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Discover Links */}
          <nav aria-label="Discover links" className="col-span-1">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4 text-[10px] opacity-80">Discover</h3>
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

          {/* Features Links */}
          <nav aria-label="Features links" className="col-span-1">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4 text-[10px] opacity-80">Features</h3>
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

          {/* Account Links */}
          <nav aria-label="Account links" className="col-span-1">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4 text-[10px] opacity-80">Account</h3>
            <ul className="space-y-3">
              {accountLinks.map(({ label, to, title }) => (
                <li key={label}>
                  <Link to={to} title={title} className="text-[#475569] hover:text-[#BFBCFC] text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About + Contact info */}
          <div className="col-span-1">
            <h3 className="text-[#F8FAFC] font-bold text-xs tracking-widest uppercase mb-4 text-[10px] opacity-80">About the Project</h3>
            <p className="text-[#475569] text-xs leading-relaxed mb-3">
              TraceMyMovies is a third-year graduation project built by students at ROC van Twente, inspired by Letterboxd. It is a non-commercial, educational project.
            </p>
            <p className="text-[#475569] text-xs leading-relaxed mb-5">
              Film metadata is powered by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#BFBCFC] underline transition-colors" title="The Movie Database (TMDB)">TMDB</a>.
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
            <span className="text-[#BFBCFC]/60 font-semibold mr-2">Powered by TMDB</span>
            <span>·</span>
            
            {/* Language Selector */}
            <div className="flex items-center gap-1 text-[#475569] ml-1">
              <Globe className="w-3.5 h-3.5" />
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  toast.success(`Language set to ${e.target.value === 'en' ? 'English' : 'Nederlands'}`);
                }}
                className="bg-transparent text-[#475569] hover:text-[#BFBCFC] focus:outline-none cursor-pointer text-xs"
                title="Change language"
              >
                <option value="en" className="bg-[#0D1017] text-[#F8FAFC]">EN</option>
                <option value="nl" className="bg-[#0D1017] text-[#F8FAFC]">NL</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
