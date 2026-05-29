export function MovieOverview({ overview }) {
    if (!overview) return null;

    return (
        <div>
            <h2 className="text-xl font-bold font-heading text-[#F8FAFC] mb-3">
                Overview
            </h2>

            <p className="text-[#94A3B8] leading-relaxed text-sm">
                {overview}
            </p>
        </div>
    );
}