import { Film, Star, TrendingUp, Clock } from "lucide-react";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      {/* Total Watched */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Film className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
            </div>
            <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
              Total Watched
            </h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
            274
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[#44FFFF] text-xs font-data font-medium">
              +18 this month
            </span>
            <TrendingUp className="w-3 h-3 text-[#44FFFF]" />
          </div>
        </div>
      </div>

      {/* Average Score */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Star className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" fill="#BFBCFC" />
            </div>
            <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
              Average Score
            </h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
            7.8
          </p>
          <p className="text-[#44FFFF] text-xs font-data font-medium">
            out of 10 ★
          </p>
        </div>
      </div>

      {/* Watch Streak */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
            </div>
            <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
              Watch Streak
            </h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
            12
          </p>
          <p className="text-[#44FFFF] text-xs font-data font-medium">
            days in a row
          </p>
        </div>
      </div>

      {/* Total Hours */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Clock className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
            </div>
            <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
              Total Hours
            </h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
            548
          </p>
          <p className="text-[#44FFFF] text-xs font-data font-medium">
            ≈ 22.8 days
          </p>
        </div>
      </div>
    </div>
  );
}