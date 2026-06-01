import { Sparkles } from "lucide-react";

export function AnalyticsHeader() {
  return (
    <div className="mb-6 md:mb-8 text-center">
      <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-accent/10 rounded-xl mb-2 md:mb-3">
        <Sparkles className="w-6 md:w-7 h-6 md:h-7 text-accent" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-1 md:mb-2">
        Movie DNA
      </h1>

      <p className="text-muted-foreground text-sm md:text-base">
        Your personal cinematic analytics and insights
      </p>
    </div>
  );
}