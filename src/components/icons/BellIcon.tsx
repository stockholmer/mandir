interface IconProps {
  className?: string;
  size?: number;
}

export default function BellIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Temple Bell — Ghanta, clean silhouette */}
      {/* Hanging loop */}
      <path d="M10 3C10 1.9 10.9 1 12 1C13.1 1 14 1.9 14 3V4H10V3Z" opacity="0.7" />
      {/* Bell body */}
      <path d="M8 5H16C16 5 17.5 9 18 14C18.3 17 18 19 18 19H6C6 19 5.7 17 6 14C6.5 9 8 5 8 5Z" />
      {/* Bell rim */}
      <rect x="5" y="19" width="14" height="2" rx="1" />
      {/* Clapper */}
      <circle cx="12" cy="22.5" r="1.5" opacity="0.6" />
    </svg>
  );
}
