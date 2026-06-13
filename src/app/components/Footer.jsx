export function Footer() {
  return (
    <footer className="bg-[#151921]/50 backdrop-blur-xl border-t border-[#BFBCFC]/15 mt-12 md:mt-16 lg:mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-[#94A3B8] text-xs md:text-sm font-body">
            <p>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB. It is not intended for commercial use and was created as a
              school project inspired by the great Letterboxd.
            </p>
            <p className="mt-2">
              © 2026 TraceMyMovies. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6 md:gap-8">
            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#BFBCFC] transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Twitter
            </a>

            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#BFBCFC] transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Facebook
            </a>

            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#BFBCFC] transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}