export function HeroSkeleton() {
    return (
        <div className="relative h-[350px] md:h-[450px] lg:h-[500px] bg-[#151921] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent" />
        </div>
    );
}