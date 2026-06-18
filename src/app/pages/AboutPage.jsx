import { Film, Users, Star, Trophy, Clapperboard, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const TEAM = [
  { name: 'Sunny Lim',          initial: 'S', color: '#BFBCFC' },
  { name: 'Jad Saloum',         initial: 'J', color: '#44FFFF' },
  { name: 'Salim Siksik',       initial: 'S', color: '#FF61D2' },
  { name: 'Andre Huang',        initial: 'A', color: '#FFD700' },
  { name: 'Christian Gawriyah', initial: 'C', color: '#4ADE80' },
];

const FEATURES = [
  { icon: Film,   color: '#BFBCFC', title: 'Track Every Film',  desc: 'Log every movie you watch and build a personal archive of your cinema history.' },
  { icon: Star,   color: '#FFD700', title: 'Rate & Review',      desc: 'Give scores, write reviews and share your opinion with the community.' },
  { icon: Users,  color: '#FF61D2', title: 'Follow Friends',     desc: 'See what friends are watching, compare tastes and discover films together.' },
  { icon: Trophy, color: '#44FFFF', title: 'Earn Badges',        desc: 'Unlock achievements as you explore more genres and reach milestones.' },
];

export function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC]">

      {/* ── Hero ── */}
      <section className="pt-12 pb-10 md:pt-24 md:pb-20">
        <div className="container mx-auto px-5 sm:px-6 max-w-3xl text-center">

          {/* Logo + Title — stacks on very small screens, row on sm+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 rounded-3xl blur-2xl scale-110"
                style={{ background: 'radial-gradient(circle, rgba(191,188,252,0.35) 0%, transparent 70%)' }}
              />
              <img
                src="/logo.png"
                alt="TraceMyMovies"
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 object-contain drop-shadow-[0_0_32px_rgba(191,188,252,0.5)]"
              />
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight sm:text-left"
              style={{ textShadow: '0 0 60px rgba(191,188,252,0.2)' }}
            >
              TraceMyMovies
            </h1>
          </div>

          {/* Badge divider */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#BFBCFC]/40" />
            <div className="inline-flex items-center gap-1.5 bg-[#BFBCFC]/10 border border-[#BFBCFC]/20 text-[#BFBCFC] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              Year 3 · ROC van Twente
            </div>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#BFBCFC]/40" />
          </div>

          {/* Tagline */}
          <p className="text-[#64748B] text-sm md:text-base max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
            A fully functional film-tracking platform built from the ground up by five Software Development students — from concept and design to backend API and production deployment.
          </p>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="relative py-10 md:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#BFBCFC]/4 rounded-full blur-[100px]" />
        </div>

        <div className="relative container mx-auto px-5 sm:px-6 max-w-5xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 text-[#FF61D2] text-xs font-bold tracking-widest uppercase mb-2">
              <Heart className="w-3.5 h-3.5" />
              The team
            </div>
            <h2 className="text-xl md:text-3xl font-black mb-2">Meet the people behind it</h2>
            <p className="text-[#475569] text-sm max-w-xs mx-auto">
              Five third-year Software Development students from ROC van Twente.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {TEAM.map(({ name, initial, color }) => (
              <div key={name} className="group flex flex-col items-center text-center w-28 sm:w-36 md:w-40">
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
                    border: `2px solid ${color}40`,
                    boxShadow: `0 8px 32px ${color}20`,
                  }}
                >
                  <span
                    className="text-2xl sm:text-3xl md:text-4xl font-black"
                    style={{ color, textShadow: `0 0 20px ${color}60` }}
                  >
                    {initial}
                  </span>
                  <div
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-[#0B0E14]"
                    style={{ background: color }}
                  />
                </div>
                <p className="text-[#F8FAFC] font-bold text-xs sm:text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#BFBCFC]/10 to-transparent mx-5 sm:mx-auto max-w-5xl" />

      {/* ── What we built ── */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-5 sm:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#FF61D2] text-xs font-bold tracking-widest uppercase mb-3">
                <Clapperboard className="w-3.5 h-3.5" />
                What we built
              </div>
              <h2 className="text-xl md:text-3xl font-black mb-4 leading-tight">
                A platform for true film lovers
              </h2>
              <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-3">
                TraceMyMovies lets users keep track of films they have watched, want to see, or simply love. Think of it as a personal film diary combined with a social platform.
              </p>
              <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-5">
                The project covers a full development cycle: requirements, design, backend API, frontend interface, authentication, real-time features and deployment — all built ourselves.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-5 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#BFBCFC]/30"
              >
                Try it yourself
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 md:mt-0">
              {[
                { value: 'Year 3',     label: 'School Year',    color: '#BFBCFC' },
                { value: '100%',       label: 'Our own work',   color: '#44FFFF' },
                { value: 'TMDB',       label: 'Film database',  color: '#FFD700' },
                { value: 'Full-stack', label: 'From API to UI', color: '#FF61D2' },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-[#0F1219] border border-white/5 rounded-2xl p-4 md:p-5 text-center">
                  <div className="text-lg md:text-2xl font-black mb-1" style={{ color }}>{value}</div>
                  <div className="text-[#475569] text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-5 sm:px-6 max-w-5xl">
          <div className="text-center mb-8 md:mb-14">
            <div className="inline-flex items-center gap-2 text-[#44FFFF] text-xs font-bold tracking-widest uppercase mb-2">
              <Star className="w-3.5 h-3.5" />
              Features
            </div>
            <h2 className="text-xl md:text-3xl font-black">What can you do?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {FEATURES.map(({ icon: FeatureIcon, color, title, desc }) => (
              <div
                key={title}
                className="group flex gap-4 bg-[#0F1219] border border-white/5 rounded-2xl p-4 md:p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <FeatureIcon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-bold text-[#F8FAFC] text-sm mb-1">{title}</h3>
                  <p className="text-[#475569] text-xs md:text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#BFBCFC]/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative container mx-auto px-5 sm:px-6 max-w-2xl text-center">
          <img src="/logo.png" alt="TraceMyMovies" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(191,188,252,0.4)]" />
          <h2 className="text-xl md:text-3xl font-black mb-3">Ready to get started?</h2>
          <p className="text-[#64748B] text-sm mb-6 max-w-xs mx-auto">
            Create a free account and start tracking your films today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isAuthenticated && (
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#BFBCFC] hover:bg-white text-[#0B0E14] px-7 py-3 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#BFBCFC]/30"
              >
                Create an account
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              to="/movies"
              className="flex items-center gap-2 text-[#64748B] hover:text-[#F8FAFC] text-sm font-medium transition-colors"
            >
              Browse films
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
