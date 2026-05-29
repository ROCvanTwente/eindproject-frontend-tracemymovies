import React from "react";
import { MovieOverview } from "./MovieOverview";
import { CastSection } from "./CastSection";
import { InfoCards } from "./InfoCards";
import { RecommendationsSection } from "./RecommendationsSection";
import { ReviewSection } from "../ReviewSection";
import { MovieSidebar } from "./MovieSidebar";

export function MovieDetailContent({ movie, loadingRecommendations, recommendations }) {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 mt-6 md:mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-10">
          <MovieOverview overview={movie.overview} />
          
          <CastSection cast={movie.credits?.cast || []} />
          
          <InfoCards movie={movie} />
          
          <div>
            <h2 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Recommendations
            </h2>
            <RecommendationsSection
              loading={loadingRecommendations}
              recommendations={recommendations}
            />
          </div>

          <ReviewSection movieId={movie.id} movieTitle={movie.title} />
        </div>

        <MovieSidebar movie={movie} />
      </div>
    </div>
  );
}