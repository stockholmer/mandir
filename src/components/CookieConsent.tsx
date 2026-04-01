"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const COOKIE_CONSENT_KEY = "cookie-consent";

/** Dispatch this event to re-open the cookie consent banner. */
export const COOKIE_CONSENT_REOPEN_EVENT = "cookie-consent-reopen";

/** Dispatched when cookie consent is saved — allows same-tab listeners to react. */
export const COOKIE_CONSENT_CHANGED_EVENT = "cookie-consent-changed";

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const showBanner = useCallback(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Use requestAnimationFrame to defer state update
      const raf = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  // Listen for re-open events (triggered by "Cookie Preferences" link)
  useEffect(() => {
    window.addEventListener(COOKIE_CONSENT_REOPEN_EVENT, showBanner);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_REOPEN_EVENT, showBanner);
    };
  }, [showBanner]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }

  function handleEssentialOnly() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-out ${
        animateIn ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-saffron-200 bg-white/80 backdrop-blur-lg shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Message */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm leading-relaxed text-gray-700">
                {t("message")}{" "}
                <Link
                  href="/cookies"
                  className="font-medium text-saffron-600 underline decoration-saffron-300 underline-offset-2 transition-colors hover:text-saffron-700"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 gap-3">
              <button
                onClick={handleEssentialOnly}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-saffron-500/20 focus:ring-offset-2 focus:outline-none"
              >
                {t("essentialOnly")}
              </button>
              <button
                onClick={handleAccept}
                className="rounded-lg bg-saffron-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-saffron-700 focus:ring-2 focus:ring-saffron-500/20 focus:ring-offset-2 focus:outline-none"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
