import React from 'react';
import { Wrench, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function MaintenancePage({ onRetry }) {
  return (
    <div className="min-h-screen bg-[#0B0E14] bg-radial from-[#1A102F]/30 via-transparent to-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#BFBCFC]/5 rounded-full blur-3xl animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#44FFFF]/5 rounded-full blur-3xl animate-pulse duration-[6000ms]"></div>

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#151921]/60 border border-[#BFBCFC]/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_0_rgba(191,188,252,0.05)] backdrop-blur-xl text-center space-y-8 animate-fade-in">
        
        {/* Animated Icon Header */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#BFBCFC]/20 to-[#44FFFF]/20 animate-ping opacity-75"></div>
          {/* Inner glass icon bg */}
          <div className="relative w-20 h-20 bg-gradient-to-tr from-[#1E2538] to-[#151921] border border-[#BFBCFC]/30 rounded-full flex items-center justify-center shadow-lg shadow-black/40">
            <Wrench className="w-10 h-10 text-[#BFBCFC] animate-bounce duration-[3000ms]" />
          </div>
          {/* Tiny lock/alert badge */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF61D2] border-2 border-[#151921] rounded-full flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC]">
            System Under Maintenance
          </h1>
          <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
            TraceMyMovies is temporarily offline while we apply upgrades. Normal access is currently restricted, but we will be back shortly!
          </p>
        </div>

        {/* Status indicator block */}
        <div className="bg-[#0B0E14]/75 border border-[#BFBCFC]/10 rounded-2xl p-4 flex items-center justify-between text-xs font-mono text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF61D2] animate-pulse"></span>
            <span className="text-[#94A3B8]">Platform Status:</span>
          </div>
          <span className="text-[#FF61D2] font-bold uppercase tracking-wider">Maintenance Mode</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full py-3.5 bg-gradient-to-r from-[#BFBCFC] to-[#AFA9FF] hover:from-[#AFA9FF] hover:to-[#9F99FF] text-[#0B0E14] font-bold rounded-xl shadow-lg shadow-[#BFBCFC]/15 hover:shadow-[#BFBCFC]/25 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Check Connection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Admin Entry Link */}
        <div className="pt-4 border-t border-[#BFBCFC]/10 flex items-center justify-center text-xs text-[#94A3B8] gap-1.5">
          <span>Are you staff?</span>
          <Link
            to="/login"
            className="text-[#BFBCFC] hover:text-[#44FFFF] font-semibold transition-colors flex items-center gap-0.5 underline decoration-[#BFBCFC]/30 hover:decoration-[#44FFFF]/50 underline-offset-4"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
