import React from "react";
import { MovieOverview } from "./MovieOverview";
import { CastSection } from "./CastSection";
import { InfoCards } from "./InfoCards";
import { RecommendationsSection } from "./RecommendationsSection";
import { MovieSidebar } from "./MovieSidebar";
import { MovieHeroDetails } from "./MovieHeroDetails";
import { MovieHeroActions } from "./MovieHeroActions";
import { ProfilePosterCard } from "../ProfilePosterCard";
import { ReviewSection } from "../review/ReviewSection";

export function MovieDetailContent({
  movie,
  loadingRecommendations,
  recommendations,
  streamingProviders,
  isWatched,
  isFavorite,
  filmRating,
  watchCount,
  isInWatchlist,
  onToggleWatch,
  onToggleLike,
  onToggleWatchlist,
  isSavingWatch,
  isSavingLike,
  isSavingWatchlist,
  onSetRating,
  onOpenLog,
  onOpenEditLog,
  onOpenTrailer,
  onOpenShare,
  hasReview,
  hasLog,
  isLoggedIn,
  reviewsEnabled,
}) {
  return (
    <div className="container mx-auto px-4 max-w-7xl -mt-12 md:-mt-16 relative z-10 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Poster + title */}
          <div className="flex gap-5 md:gap-6 items-end">
            <div className="w-28 md:w-40 flex-shrink-0">
              <ProfilePosterCard
                movieId={movie.id}
                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                title={movie.title}
                isWatchedProp={isWatched}
                isLikedProp={isFavorite}
              />
            </div>
            <div className="pb-1">
              <MovieHeroDetails
                title={movie.title}
                tagline={movie.tagline}
                releaseDate={movie.release_date}
                runtime={movie.runtime}
                ageRating={movie.age_rating}
              />
              <MovieHeroActions
                onOpenTrailer={onOpenTrailer}
                onOpenShare={onOpenShare}
              />
            </div>
          </div>

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

          <ReviewSection movieId={movie.id} movieTitle={movie.title} hideForm />
        </div>

        {/* ── RIGHT COLUMN: sidebar, same top as poster ── */}
        <MovieSidebar
          movie={movie}
          streamingProviders={streamingProviders}
          isWatched={isWatched}
          isFavorite={isFavorite}
          filmRating={filmRating}
          watchCount={watchCount}
          isInWatchlist={isInWatchlist}
          onToggleWatch={onToggleWatch}
          onToggleLike={onToggleLike}
          onToggleWatchlist={onToggleWatchlist}
          isSavingWatch={isSavingWatch}
          isSavingLike={isSavingLike}
          isSavingWatchlist={isSavingWatchlist}
          onSetRating={onSetRating}
          onOpenLog={onOpenLog}
          onOpenEditLog={onOpenEditLog}
          hasReview={hasReview}
          hasLog={hasLog}
          isLoggedIn={isLoggedIn}
          reviewsEnabled={reviewsEnabled}
        />
      </div>
    </div>
  );
}
