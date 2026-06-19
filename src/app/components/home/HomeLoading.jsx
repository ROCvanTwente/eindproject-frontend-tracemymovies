export function HomeLoading() {
    return (
        // Flexbox container die de spinner exact in het midden van het scherm uitlijnt
        <div className="min-h-screen flex items-center justify-center">
            {/* Ronddraaiende spinner (border-t-2 en border-b-2 creëren de inkepingen) */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#BFBCFC]" />
        </div>
    );
}