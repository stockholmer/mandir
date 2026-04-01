'use client';

import { type ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  align?: 'center' | 'left';
  divider?: boolean;
}

/**
 * Consistent section heading used across pages. Displays an optional icon badge,
 * a Playfair Display title, an optional gradient underline accent, and a subtitle.
 */
export default function SectionHeader({
  title,
  subtitle,
  icon,
  align = 'center',
  divider = true,
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={isCenter ? 'text-center' : 'text-left'}>
      {/* Optional icon badge */}
      {icon && (
        <div
          className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 p-3 text-saffron-600 shadow-sm ${
            isCenter ? '' : ''
          }`}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h2
        className="text-section font-display font-bold tracking-tight text-gray-900"
      >
        {title}
      </h2>

      {/* Gradient underline accent */}
      {divider && (
        <div
          className={`mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-saffron-400 to-gold-400 ${
            isCenter ? 'mx-auto' : ''
          }`}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-8 text-gray-600 ${
            isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
