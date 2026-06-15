import { TrendingUp, Star, CalendarClock } from 'lucide-react';
import { MovieCarousel } from '../MovieCarousel';

const SECTIONS = [
  {
    key: 'popular',
    title: 'Popular Now',
    subtitle: 'What everyone is watching this week',
    icon: TrendingUp,
    color: '#FF61D2',
    prop: 'popularMovies',
    extraProps: {},
  },
  {
    key: 'topRated',
    title: 'Top Rated',
    subtitle: 'The highest-scored films of all time',
    icon: Star,
    color: '#44FFFF',
    prop: 'topRatedMovies',
    extraProps: { showRanking: true },
  },
  {
    key: 'upcoming',
    title: 'Coming Soon',
    subtitle: 'Films hitting cinemas near you',
    icon: CalendarClock,
    color: '#BFBCFC',
    prop: 'upcomingMovies',
    extraProps: { showReleaseDate: true },
  },
];

function SectionHeader({ title, subtitle, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 md:mb-6">
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}35` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <h2 className="text-sm md:text-base font-black text-[#F8FAFC] leading-tight">{title}</h2>
        <p className="text-[#475569] text-[10px] md:text-xs mt-0.5 hidden sm:block">{subtitle}</p>
      </div>
    </div>
  );
}

export function HomeMovieLists({ popularMovies, topRatedMovies, upcomingMovies }) {
  const movieMap = { popularMovies, topRatedMovies, upcomingMovies };

  return (
    <div className="pb-12 md:pb-24">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#BFBCFC]/12 to-transparent mb-7 md:mb-12" />

      <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
        <div className="space-y-8 md:space-y-14">
          {SECTIONS.map(({ key, title, subtitle, icon, color, prop, extraProps }) => (
            <section key={key}>
              <SectionHeader title={title} subtitle={subtitle} icon={icon} color={color} />
              <MovieCarousel
                movies={movieMap[prop]}
                {...extraProps}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
