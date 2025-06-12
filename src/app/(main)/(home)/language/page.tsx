"use client"; // Or make it a server component if just displaying text

import React from "react";
import { useTranslations } from "next-intl";
// import LanguageSwitcher from "@/components/LanguageSwitcher"; // Optional: also show switcher here

export default function LanguagePage() {
  // const t = useTranslations("LanguagePage"); // If you add messages for this page

  return (
    <div className="min-h-screen flex-1 bg-gray-100 p-4 dark:bg-slate-900 sm:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          {/* Placeholder: {t('title')} */} Language Settings
        </h1>
        <p className="text-md mt-1 text-gray-600 dark:text-gray-400 sm:text-lg">
          {/* Placeholder: {t('description')} */}
          Choose your preferred language for the application interface.
          The language switcher is available in the main navigation bar.
        </p>
      </header>
      {/* <div className="max-w-xs"> <LanguageSwitcher /> </div> */}
    </div>
  );
}
