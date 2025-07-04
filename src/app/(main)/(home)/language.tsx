// Updated: LanguageScreen.tsx
"use client"; // If any client-side interactions are added later, or for consistency

import React from "react";

export default function LanguageScreen() {
  return (
    <div className="flex flex-col flex-1 bg-gray-50 dark:bg-slate-900 px-5 pt-6"> {/* Page Background */}
      {/* Heading - commented out in original, kept as is */}
      {/* <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        Need Language Help?
      </h2> */}

      {/* Subheading */}
      <p className="mb-4 text-base text-gray-700 dark:text-gray-300">
        Use the tool below to translate text or phrases using Google Translate.
      </p>

      {/* iframe container */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-md">
        <iframe
          src="https://translate.google.com/"
          title="Google Translate"
          className="h-full w-full" // Ensure iframe takes full space of its container
          // sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Optional: for added security, but might restrict functionality
          // Consider adding allow="fullscreen" if that's a desired feature
        />
      </div>
    </div>
  );
}
