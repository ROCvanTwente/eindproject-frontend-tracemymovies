export function HomeError({ message }) {
    return (
        // Gecentreerde lay-out voor het opvangen van foutsituaties
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {/* Fouttitel */}
            <div className="text-red-400 text-xl font-semibold mb-2">
                Oops! Something went wrong
            </div>
            {/* Dynamische foutmelding met een ingebouwde standaard fallback-tekst */}
            <p className="text-gray-400 max-w-sm text-sm">
                {message || "We had trouble loading the movie dashboards. Please check your connection."}
            </p>
            {/* Actieknop waarmee de gebruiker de pagina direct kan forceren te herladen */}
            <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-5 py-2 bg-[#BFBCFC] text-slate-900 rounded-md font-semibold text-sm hover:bg-[#a5a2e5] transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}