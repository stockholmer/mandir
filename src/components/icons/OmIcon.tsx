interface IconProps {
  className?: string;
  size?: number;
}

export default function OmIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {/* Use the actual Devanagari Om glyph for perfect rendering at any size */}
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fill="currentColor"
        fontSize="22"
        fontFamily="'Noto Sans Devanagari', serif"
        fontWeight="600"
      >
        &#x0950;
      </text>
    </svg>
  );
}
