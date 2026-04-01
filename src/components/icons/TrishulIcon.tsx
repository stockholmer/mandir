interface IconProps {
  className?: string;
  size?: number;
}

export default function TrishulIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Trishul — Shiva's Trident, clean and bold */}
      {/* Center prong */}
      <path d="M11 1H13L13.5 10H10.5L11 1Z" />
      {/* Left prong */}
      <path d="M5 5L7 4L10.5 10L8 10.5L5 5Z" />
      {/* Right prong */}
      <path d="M19 5L17 4L13.5 10L16 10.5L19 5Z" />
      {/* Cross bar */}
      <rect x="7" y="10" width="10" height="2" rx="1" />
      {/* Shaft */}
      <rect x="11" y="12" width="2" height="10" rx="1" />
      {/* Base point */}
      <path d="M11 22H13L12 23.5L11 22Z" opacity="0.7" />
    </svg>
  );
}
