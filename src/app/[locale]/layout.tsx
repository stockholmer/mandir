import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const localeToOG: Record<string, string> = {
  sv: "sv_SE",
  en: "en_US",
  hi: "hi_IN",
  sa: "sa_IN",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("siteName"),
    },
    description: t("siteName"),
    openGraph: {
      locale: localeToOG[locale] || "sv_SE",
      alternateLocales: Object.values(localeToOG).filter(
        (l) => l !== (localeToOG[locale] || "sv_SE")
      ),
      siteName: t("siteName"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate the locale
  if (!routing.locales.includes(locale as "sv" | "en" | "hi" | "sa")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-saffron-500 focus:text-white"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
