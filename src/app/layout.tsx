import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Hindu Mandir Stockholm",
    default: "Hindu Mandir Stockholm",
  },
  description:
    "Stockholm Hindu Mandir — serving the Hindu community in Stockholm, Sweden since 1980.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
