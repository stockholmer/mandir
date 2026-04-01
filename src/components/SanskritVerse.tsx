'use client';

interface SanskritVerseProps {
  verse: string;
  translation: string;
  source?: string;
  className?: string;
}

/**
 * Displays a Sanskrit sloka (Devanagari text) with its translation and optional
 * attribution. Uses Noto Sans Devanagari for the verse and Playfair Display for
 * the translation, on a warm cream/gold background with a subtle mandala watermark.
 */
export default function SanskritVerse({
  verse,
  translation,
  source,
  className = '',
}: SanskritVerseProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gold-200/60 bg-[#fffbf0] px-6 py-8 sm:px-10 sm:py-10 ${className}`}
    >
      {/* Subtle mandala watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="relative text-center">
        {/* Verse in Devanagari */}
        <p
          className="text-xl leading-relaxed text-warm-gray-800 sm:text-2xl"
          style={{ fontFamily: 'var(--font-devanagari)' }}
          lang="sa"
        >
          {verse}
        </p>

        {/* Decorative separator */}
        <div className="mx-auto my-4 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400" />
          <svg
            className="h-3 w-3 text-gold-400"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" />
          </svg>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400" />
        </div>

        {/* Translation */}
        <p
          className="mx-auto max-w-lg font-display text-base italic leading-relaxed text-warm-gray-600 sm:text-lg"
        >
          &ldquo;{translation}&rdquo;
        </p>

        {/* Source attribution */}
        {source && (
          <p className="mt-4 text-sm font-medium tracking-wide text-gold-600">
            &mdash; {source}
          </p>
        )}
      </div>
    </div>
  );
}
