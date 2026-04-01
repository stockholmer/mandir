import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-dusk text-white py-24 px-6 overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-hero font-display font-bold mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-saffron-200">
            {t("hero.subtitle")}
          </p>
          <p className="mt-4 text-lg text-gold-300 font-devanagari">
            {t("hero.blessing")}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-warm-cream">
        <div className="max-w-4xl mx-auto text-center pillar-accent-both px-8">
          <h2 className="text-section font-display font-bold text-warm-gray-900 mb-6">
            {t("about.title")}
          </h2>
          <p className="text-lg text-warm-gray-600 leading-relaxed">
            {t("about.description")}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-section font-display font-bold text-warm-gray-900 mb-12">
            {t("services.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                { key: "puja", descKey: "pujaDesc" },
                { key: "events", descKey: "eventsDesc" },
                { key: "bhandara", descKey: "bhandaraDesc" },
                { key: "community", descKey: "communityDesc" },
              ] as const
            ).map(({ key, descKey }) => (
              <div
                key={key}
                className="p-6 rounded-xl bg-white border border-warm-gray-200 card-hover sacred-glow"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-sunrise mx-auto mb-4" />
                <h3 className="font-display font-semibold text-lg text-warm-gray-900 mb-2">
                  {t(`services.${key}`)}
                </h3>
                <p className="text-sm text-warm-gray-500">
                  {t(`services.${descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
