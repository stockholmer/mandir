'use client';

import { type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type HeroGradient = 'saffron' | 'maroon' | 'emerald' | 'gold' | 'dark';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  gradient?: HeroGradient;
  breadcrumbs?: BreadcrumbItem[];
  pattern?: boolean;
  badge?: string;
  children?: ReactNode;
}

/** Gradient background classes for each variant */
const gradientClasses: Record<HeroGradient, string> = {
  saffron: 'from-saffron-600 via-saffron-700 to-saffron-800',
  maroon: 'from-saffron-600 via-maroon-700 to-maroon-800',
  emerald: 'from-emerald-600 via-emerald-700 to-emerald-800',
  gold: 'from-saffron-600 via-gold-600 to-gold-700',
  dark: 'from-gray-900 via-gray-900 to-maroon-900',
};

/** Accent blur circle colors that complement each gradient */
const accentColors: Record<HeroGradient, { topRight: string; bottomLeft: string }> = {
  saffron: { topRight: 'bg-white/5', bottomLeft: 'bg-saffron-400/10' },
  maroon: { topRight: 'bg-white/5', bottomLeft: 'bg-saffron-400/10' },
  emerald: { topRight: 'bg-white/5', bottomLeft: 'bg-emerald-400/10' },
  gold: { topRight: 'bg-white/5', bottomLeft: 'bg-gold-400/10' },
  dark: { topRight: 'bg-saffron-500/10', bottomLeft: 'bg-maroon-500/10' },
};

/**
 * Unified hero section used across all public pages. Replaces 14+ hand-coded
 * hero implementations with a single, consistent component.
 *
 * Features: gradient background, decorative blur circles, hero-pattern overlay,
 * mandala watermark, glassmorphism badge, breadcrumbs, Playfair Display heading.
 */
export default function HeroSection({
  title,
  subtitle,
  icon,
  gradient = 'saffron',
  breadcrumbs,
  pattern = true,
  badge,
  children,
}: HeroSectionProps) {
  const gradientClass = gradientClasses[gradient];
  const accent = accentColors[gradient];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} py-12 text-white sm:py-16`}
    >
      {/* Mandala watermark at very low opacity */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, white 1px, transparent 1px), radial-gradient(circle at 50% 50%, white 0.5px, transparent 0.5px)',
          backgroundSize: '60px 60px, 30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* Hero pattern overlay */}
      {pattern && <div className="hero-pattern absolute inset-0" />}

      {/* Decorative blur circles */}
      <div
        className={`absolute -right-32 -top-32 h-96 w-96 rounded-full ${accent.topRight} blur-3xl`}
      />
      <div
        className={`absolute -bottom-20 -left-20 h-72 w-72 rounded-full ${accent.bottomLeft} blur-3xl`}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="mb-6 flex items-center justify-center gap-2 text-sm text-white/70"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="mx-auto max-w-2xl text-center">
          {/* Glassmorphism badge */}
          {badge && (
            <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {badge}
            </div>
          )}

          {/* Icon (standalone, when no badge) */}
          {icon && !badge && (
            <div className="mb-5 flex justify-center">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                {icon}
              </div>
            </div>
          )}

          {/* Title */}
          <h1
            className="text-page-title font-display font-extrabold tracking-tight"
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-6 text-lg leading-8 text-white/80">
              {subtitle}
            </p>
          )}

          {/* Extra content (CTA buttons, etc.) */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
