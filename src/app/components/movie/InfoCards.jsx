import { Calendar, Clock, DollarSign } from "lucide-react";
import { InfoCard } from "./InfoCard";

export function InfoCards({ movie }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoCard
                icon={<Calendar className="w-3.5 h-3.5 text-[#44FFFF]" />}
                label="Release Date"
                value={movie.release_date}
            />

            <InfoCard
                icon={<Clock className="w-3.5 h-3.5 text-[#44FFFF]" />}
                label="Runtime"
                value={`${movie.runtime} min`}
            />

            <InfoCard
                icon={<DollarSign className="w-3.5 h-3.5 text-[#44FFFF]" />}
                label="Budget"
                value={
                    movie.budget > 0
                        ? `$${(movie.budget / 1000000).toFixed(0)}M`
                        : "N/A"
                }
            />
        </div>
    );
}