'use client';

import { OmIcon, DiyaIcon, MandalaIcon, LotusIcon } from '@/components/icons';

type DividerVariant = 'lotus' | 'om' | 'diya' | 'mandala' | 'line';

interface SacredDividerProps {
  variant?: DividerVariant;
  className?: string;
  color?: string;
}

/**
 * Sacred section divider — a thin horizontal line with a sacred icon in the center.
 * The variant prop selects which icon appears. The 'line' variant shows no icon.
 */
export default function SacredDivider({
  variant = 'lotus',
  className = '',
  color,
}: SacredDividerProps) {
  const iconColor = color ?? 'var(--color-saffron-300)';

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 py-8 ${className}`}
    >
      {/* Left line */}
      <div
        className="h-px flex-1 max-w-[120px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
        }}
      />

      {/* Center icon */}
      {variant !== 'line' && (
        <div style={{ color: iconColor }}>
          <DividerIcon variant={variant} />
        </div>
      )}

      {/* Right line */}
      <div
        className="h-px flex-1 max-w-[120px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
        }}
      />
    </div>
  );
}

function DividerIcon({ variant }: { variant: Exclude<DividerVariant, 'line'> }) {
  const size = 28;

  switch (variant) {
    case 'lotus':
      return <LotusIcon size={size} className="text-current" />;
    case 'om':
      return <OmIcon size={size} className="text-current" />;
    case 'diya':
      return <DiyaIcon size={size} className="text-current" />;
    case 'mandala':
      return <MandalaIcon size={size} className="text-current" />;
  }
}
