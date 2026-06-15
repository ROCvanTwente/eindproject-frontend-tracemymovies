import { Eye, Star, Users, Trophy, ArrowRight, Clapperboard } from 'lucide-react';
import { Link } from 'react-router';
import { useHomeMovies } from '../hooks/useHomeMovies';
import { useAuth } from '../context/AuthContext';
import { HeroSection } from '../components/HeroSection';
import { HomeLoading } from '../components/home/HomeLoading';
import { HomeError } from '../components/home/HomeError';
import { HomeMovieLists } from '../components/home/HomeMovieLists';

const FEATURES = [
  {
    icon: Eye,
    color: '#44FFFF',
    glow: 'rgba(68,255,255,0.15)',
    title: 'Track Every Film',
    desc: 'Log every movie you watch and build your personal history.',
  },
  {
    icon: Star,
    color: '#BFBCFC',
    glow: 'rgba(191,188,252,0.15)',
    title: 'Rate & Review',
    desc: 'Give scores and share your thoughts with the community.',
  },
  {
    icon: Users,
    color: '#FF61D2',
    glow: 'rgba(255,97,210,0.15)',
    title: 'Follow Friends',
    desc: 'See what friends are watching, chat with each other and discover new films together.',
  },
  {
    icon: Trophy,
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.15)',
    title: 'Earn Badges',
    desc: 'Unlock achievements as you explore more of cinema.',
  },
];

function PlatformBanner() {
  return (
    <section className="relative py-10 md:py-18 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#BFBCFC]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#44FFFF]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Headline */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#BFBCFC]/10 border border-[#BFBCFC]/20 text-[#BFBCFC] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
            <Clapperboard className="w-3 h-3" />
            Your Cinema Companion
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F8FAFC] mb-3 leading-tight">
            Track what you watch.
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #BFBCFC, #44FFFF)' }}>
              Share what you love.
            </span>
          </h2>
          <p className="text-[#64748B] text-sm md:text-base max-w-md mx-auto">
            Your free space to log every film, rate, review, and connect with friends.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 mb-8 md:mb-12">
          {FEATURES.map(({ icon: Icon, color, glow, title, desc }) => (
            <div
              key={title}
              className="relative bg-[#0F1219] rounded-xl md:rounded-2xl p-4 md:p-6 group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ border: `1px solid rgba(255,255,255,0.05)` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl md:rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${glow}, transparent 60%)` }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
              />
              <div
                className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
              </div>
              <h3 className="relative text-[#F8FAFC] font-bold text-xs md:text-sm mb-1">{title}</h3>
              <p className="relative text-[#475569] text-[11px] md:text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#BFBCFC]/30"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/movies"
            className="flex items-center gap-2 text-[#64748B] hover:text-[#F8FAFC] text-sm font-medium transition-colors"
          >
            Browse Films
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const { movies, loading, error } = useHomeMovies();
  const { isAuthenticated } = useAuth();

  if (loading) return <HomeLoading />;
  if (error) return <HomeError message={error} />;

  return (
    <>
      <HeroSection movies={movies.trending} />

      {!isAuthenticated && <PlatformBanner />}

      {isAuthenticated && (
        <div className="h-8 md:h-12" />
      )}

      <HomeMovieLists
        popularMovies={movies.popular}
        topRatedMovies={movies.topRated}
        upcomingMovies={movies.upcoming}
      />
    </>
  );
}
