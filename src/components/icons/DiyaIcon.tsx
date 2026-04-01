interface IconProps {
  className?: string;
  size?: number;
}

export default function DiyaIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Diya — oil lamp, clean silhouette */}
      {/* Flame */}
      <path d="M12 2C12 2 9 6 9 8.5C9 10.2 10.3 11.5 12 11.5C13.7 11.5 15 10.2 15 8.5C15 6 12 2 12 2Z" />
      {/* Inner flame highlight */}
      <path d="M12 5C12 5 10.5 7.5 10.5 8.8C10.5 9.6 11.2 10.2 12 10.2C12.8 10.2 13.5 9.6 13.5 8.8C13.5 7.5 12 5 12 5Z" opacity="0.3" fill="white" />
      {/* Lamp bowl */}
      <ellipse cx="12" cy="13" rx="6" ry="1.8" />
      <path d="M6 13C6 13 6.5 18 8 19.5C9 20.3 10.5 20.8 12 20.8C13.5 20.8 15 20.3 16 19.5C17.5 18 18 13 18 13Z" opacity="0.85" />
      {/* Base */}
      <rect x="9" y="21" width="6" height="1.5" rx="0.75" opacity="0.9" />
    </svg>
  );
}
