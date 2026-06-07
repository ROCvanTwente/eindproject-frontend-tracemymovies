import { useState } from "react";

export function ReviewTextBlock({ text, containsSpoilers }) {
  const [revealed, setRevealed] = useState(false);
  if (!containsSpoilers) {
    return <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-5">{text}</p>;
  }
  if (!revealed) {
    return (
      <>
        <span className="inline-block text-[10px] uppercase tracking-wide text-[#FF61D2]/70 border border-[#FF61D2]/30 rounded px-1.5 py-0.5 mb-2">Spoilers</span>
        <button onClick={() => setRevealed(true)} className="w-full text-left group block">
          <p className="text-[#94A3B8] text-sm italic leading-relaxed group-hover:text-[#F8FAFC] transition-colors">
            Some mysteries are meant to be discovered on screen.{" "}
            <span className="underline underline-offset-2 text-[#FF61D2]/80 group-hover:text-[#FF61D2] transition-colors">This review may reveal them.</span>
          </p>
        </button>
      </>
    );
  }
  return (
    <>
      <span className="inline-block text-[10px] uppercase tracking-wide text-[#FF61D2]/70 border border-[#FF61D2]/30 rounded px-1.5 py-0.5 mb-2">Spoilers</span>
      <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-5">{text}</p>
      <button onClick={() => setRevealed(false)} className="mt-1 text-[#94A3B8]/40 hover:text-[#94A3B8] text-xs transition-colors">Hide spoilers</button>
    </>
  );
}
