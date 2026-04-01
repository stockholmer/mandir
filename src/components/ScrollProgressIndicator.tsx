"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(scrollTop / docHeight, 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Flame moves from bottom (progress=0) to top (progress=1) along the track
  const trackHeight = 240; // px — taller track for better visibility
  const flameSize = 32; // px
  const flameOffset = (1 - progress) * (trackHeight - flameSize);

  return (
    <div
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-hidden="true"
    >
      <div className="relative" style={{ height: trackHeight }}>
        {/* Track background */}
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-saffron-200/40" />

        {/* Filled portion of track */}
        <div
          className="absolute bottom-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-t from-saffron-500 to-saffron-400 transition-[height] duration-100 ease-out"
          style={{ height: `${progress * 100}%` }}
        />

        {/* Diya flame */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-100 ease-out"
          style={{ top: flameOffset }}
        >
          {/* Glow */}
          <div className="absolute -inset-3 rounded-full bg-saffron-400/25 blur-lg" />

          {/* Flame SVG */}
          <svg
            width={flameSize}
            height={flameSize}
            viewBox="0 0 24 24"
            className="relative drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]"
          >
            {/* Diya base */}
            <ellipse cx="12" cy="20" rx="6" ry="2.5" fill="#c2410c" />
            <ellipse cx="12" cy="19.5" rx="5" ry="1.5" fill="#ea580c" />

            {/* Flame */}
            <path
              d="M12 3C12 3 8 9 8 13C8 15.2 9.8 17 12 17C14.2 17 16 15.2 16 13C16 9 12 3 12 3Z"
              fill="url(#flameGradScroll)"
            />
            {/* Inner flame */}
            <path
              d="M12 7C12 7 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 7 12 7Z"
              fill="#fbbf24"
            />

            <defs>
              <linearGradient id="flameGradScroll" x1="12" y1="3" x2="12" y2="17" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ornamental dot at top */}
        <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-saffron-400/60 shadow-sm shadow-saffron-400/30" />

        {/* Ornamental dot at bottom */}
        <div className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-saffron-400/60 shadow-sm shadow-saffron-400/30" />
      </div>
    </div>
  );
}
