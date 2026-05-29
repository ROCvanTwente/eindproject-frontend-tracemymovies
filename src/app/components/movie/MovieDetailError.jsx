import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export function MovieDetailError({ onRetry }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4">
      <div className="bg-[#151921] border border-[#BFBCFC]/15 p-8 rounded-2xl max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />

        <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">
          Fout bij laden
        </h2>

        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 bg-[#44FFFF] text-[#0B0E14] py-3 rounded-xl font-bold mt-4"
        >
          <RefreshCw className="w-4 h-4" />
          Probeer opnieuw
        </button>
      </div>
    </div>
  );
}