'use client';

interface LotusDividerProps {
  className?: string;
  color?: string;
}

/**
 * Decorative lotus divider — thin horizontal lines flanking a lotus SVG.
 * The line styling comes from the `.lotus-divider` CSS class in globals.css.
 */
export default function LotusDivider({ className = '', color }: LotusDividerProps) {
  return (
    <div aria-hidden="true" className={`lotus-divider py-1 ${className}`}>
      <svg
        className="h-10 w-10"
        style={{ color: color ?? undefined }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Center petal */}
        <path d="M12 3C10.5 7 10 10 10 12.5C10 14.4 10.9 15.5 12 15.5C13.1 15.5 14 14.4 14 12.5C14 10 13.5 7 12 3Z" />
        {/* Left petal */}
        <path d="M7 6C6.5 9.5 7 12.5 8.5 14.5C9.5 15.8 10.5 15.5 11 14.5C10 13 9 10 7 6Z" opacity="0.8" />
        {/* Right petal */}
        <path d="M17 6C17.5 9.5 17 12.5 15.5 14.5C14.5 15.8 13.5 15.5 13 14.5C14 13 15 10 17 6Z" opacity="0.8" />
        {/* Far left petal */}
        <path d="M4 10C4.5 13 6 15 8 16C9 16.5 9.5 15.5 9 14.5C7.5 13 5.5 11 4 10Z" opacity="0.55" />
        {/* Far right petal */}
        <path d="M20 10C19.5 13 18 15 16 16C15 16.5 14.5 15.5 15 14.5C16.5 13 18.5 11 20 10Z" opacity="0.55" />
        {/* Water line */}
        <path
          d="M5 19C8 17 10 16.5 12 16.5C14 16.5 16 17 19 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
