interface IconProps {
  className?: string;
  size?: number;
}

export default function ConchIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Shankha — Sacred Conch Shell, simplified spiral */}
      {/* Main shell body */}
      <path d="M14 3C18 4 21 8.5 21 14C21 17.5 19 20 16 21.5C14.5 22.2 12.5 22.5 10.5 22.5C8 22.5 6 21.5 6 19.5C6 18 7.5 17 9.5 17C11 17 12 17.8 12 19C12 19.5 11.5 19.8 11 19.8C10.3 19.8 10 19.5 10 19C10 18.7 10.3 18.5 10.8 18.5" opacity="0.9" />
      {/* Shell spiral */}
      <path
        d="M15 8C17.5 10 19 13 19 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M13 7C15.5 9 17 12 17 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.2"
      />
      {/* Shell opening */}
      <path d="M8 12C8 9.5 9.5 7.5 12 7C12.8 6.8 13 7.2 12.5 7.8C11 9 10 10.5 10 12.5C10 14 11 15 12 15.5C12.5 15.7 12.5 16 12 16C10 15.5 8 14 8 12Z" opacity="0.5" />
      {/* Top tip */}
      <path d="M13 3C12 3 11.2 3.5 11 4.5C10.8 5 11 5.5 11.5 5.5C12 5.5 12.5 5 12.5 4.5C12.5 4.2 12.8 4 13 4Z" opacity="0.6" />
    </svg>
  );
}
