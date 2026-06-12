import { useState } from 'react';

export function ExpandableReviewText({ text, maxLength = 300, className = "text-[#94A3B8] leading-relaxed text-sm md:text-base break-words break-all whitespace-pre-wrap" }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Als er geen tekst is, render dan niets
    if (!text) return null;

    // Controleer of de tekst langer is dan de toegestane lengte
    const shouldTruncate = text.length > maxLength;

    // Bepaal welke tekst we laten zien op basis van de state
    const displayText = shouldTruncate && !isExpanded 
        ? text.slice(0, maxLength).trim() + '...' 
        : text;

    return (
        <div className="flex flex-col items-start">
            <p className={className}>
                {displayText}
            </p>
            
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[#BFBCFC] hover:text-[#44FFFF] text-sm font-medium mt-1 transition-colors"
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}
        </div>
    );
}
