import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sv", "en", "hi", "sa"],
  defaultLocale: "sv",
});
