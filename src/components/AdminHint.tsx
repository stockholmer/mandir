"use client";

import { useState } from "react";

interface AdminHintProps {
  storageKey: string;
  children: React.ReactNode;
}

export default function AdminHint({ storageKey, children }: AdminHintProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
      <p className="flex-1 text-sm text-blue-800">{children}</p>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem(storageKey, "true");
        }}
        className="shrink-0 rounded-md p-1 text-blue-400 hover:text-blue-600"
        aria-label="Dismiss"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
