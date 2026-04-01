interface IconProps {
  className?: string;
  size?: number;
}

export default function KalashIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Kalash — sacred pot with coconut and leaves */}
      {/* Mango leaves */}
      <path d="M9 6C8.5 4 7 2 5 1C7 1.5 9 3 9.5 5Z" opacity="0.5" />
      <path d="M15 6C15.5 4 17 2 19 1C17 1.5 15 3 14.5 5Z" opacity="0.5" />
      {/* Coconut */}
      <circle cx="12" cy="6" r="3" />
      {/* Vessel neck */}
      <rect x="9" y="9" width="6" height="2.5" rx="0.5" opacity="0.9" />
      {/* Vessel body */}
      <path d="M7 11.5H17C17.5 11.5 18 12 18 12.5L17 20C16.8 21 16 21.5 15 21.5H9C8 21.5 7.2 21 7 20L6 12.5C6 12 6.5 11.5 7 11.5Z" />
      {/* Decorative band */}
      <rect x="8" y="15" width="8" height="1" rx="0.5" opacity="0.25" fill="white" />
      {/* Base */}
      <rect x="8" y="22" width="8" height="1.5" rx="0.75" opacity="0.8" />
    </svg>
  );
}
