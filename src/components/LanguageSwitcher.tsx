"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "../../i18n"; // Path to root i18n.ts

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;

    // Remove current locale prefix if it exists
    // e.g. /en/about -> /about
    let newPathname = pathname;
    if (pathname.startsWith(`/${locale}`)) {
      newPathname = pathname.substring(locale.length + 1);
      if (newPathname === "") { // Ensure root path is handled correctly
        newPathname = "/";
      }
    }

    // For "as-needed" localePrefix:
    // If nextLocale is the default, don't add prefix. Otherwise, add it.
    // Assuming defaultLocale is known here, or adjust logic.
    // For simplicity in this component, we'll always prefix for non-default,
    // and rely on middleware to potentially remove it for the default.
    // A more robust solution might involve checking against a `defaultLocale` const.
    // The provided `next-intl` middleware with `localePrefix: 'as-needed'` handles this.

    router.replace(`/${nextLocale}${newPathname}`);
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">{t("selectLanguage")}</label>
      <select
        id="language-select"
        value={locale}
        onChange={handleChange}
        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
