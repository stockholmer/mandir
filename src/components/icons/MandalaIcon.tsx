interface IconProps {
  className?: string;
  size?: number;
}

export default function MandalaIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Mandala — circular sacred geometry, clean at small sizes */}
      {/* Outer ring */}
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Inner ring */}
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      {/* 8 petals radiating from center */}
      <path d="M12 2L13 5.5L12 8L11 5.5Z" opacity="0.4" />
      <path d="M12 22L13 18.5L12 16L11 18.5Z" opacity="0.4" />
      <path d="M2 12L5.5 11L8 12L5.5 13Z" opacity="0.4" />
      <path d="M22 12L18.5 11L16 12L18.5 13Z" opacity="0.4" />
      <path d="M4.9 4.9L7.3 6.3L8.5 8.5L6.3 7.3Z" opacity="0.35" />
      <path d="M19.1 19.1L16.7 17.7L15.5 15.5L17.7 16.7Z" opacity="0.35" />
      <path d="M19.1 4.9L17.7 7.3L15.5 8.5L16.7 6.3Z" opacity="0.35" />
      <path d="M4.9 19.1L6.3 16.7L8.5 15.5L7.3 17.7Z" opacity="0.35" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="2" opacity="0.5" />
      {/* Small dots on outer ring at cardinal points */}
      <circle cx="12" cy="1.5" r="1" opacity="0.4" />
      <circle cx="12" cy="22.5" r="1" opacity="0.4" />
      <circle cx="1.5" cy="12" r="1" opacity="0.4" />
      <circle cx="22.5" cy="12" r="1" opacity="0.4" />
    </svg>
  );
}
