export function HomeError({ message }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="text-red-400 text-xl font-semibold mb-2">
                Oops! Something went wrong
            </div>
            <p className="text-gray-400 max-w-sm text-sm">
                {message || "We had trouble loading the movie dashboards. Please check your connection."}
            </p>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-5 py-2 bg-[#BFBCFC] text-slate-900 rounded-md font-semibold text-sm hover:bg-[#a5a2e5] transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}