import React from "react";

export function MovieHeroDetails({ title, tagline, releaseDate, runtime, ageRating }) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1.5">
        {title}
      </h1>

      {tagline && (
        <p className="text-[#BFBCFC] text-base md:text-lg italic mb-3">
          {tagline}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
        <span className="text-[#94A3B8] font-data text-xs md:text-sm">
          {releaseDate ? new Date(releaseDate).getFullYear() : ""}
        </span>

        <span className="text-[#94A3B8] hidden md:inline">•</span>

        <span className="text-[#94A3B8] font-data text-xs md:text-sm">
          {runtime} min
        </span>

        {ageRating && (
          <span className="bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded-lg text-xs font-medium">
            {ageRating}
          </span>
        )}
      </div>
    </>
  );
}