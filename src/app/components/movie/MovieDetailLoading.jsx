import React from "react";
import { Loader2 } from "lucide-react";

export function MovieDetailLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14]">
      <Loader2 className="w-8 h-8 text-[#44FFFF] animate-spin" />
    </div>
  );
}