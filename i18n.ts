import {getRequestConfig} from 'next-intl/server';
// notFound is not used in the new logic, can be removed if no other part needs it.
// For now, keeping it in case other parts of next-intl internals expect its presence.
import {notFound} from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'es'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  let effectiveLocale = locale;

  // Validate that the incoming `locale` parameter is one of the supported locales
  if (!locales.includes(locale as any)) {
    console.warn(`Invalid locale "${locale}" detected in getRequestConfig. Falling back to default locale "${defaultLocale}".`);
    effectiveLocale = defaultLocale;
    // Middleware should ideally prevent this by redirecting to a valid locale.
    // This fallback is a safety net.
  }

  // At this point, effectiveLocale is one of the strings in `locales` or `defaultLocale`.
  // Type assertion to string is safe here because defaultLocale is a string, and
  // if locale was valid, it was also a string from `locales`.
  const finalLocaleToLoad = effectiveLocale as string;

  try {
    const messages = (await import(`./messages/${finalLocaleToLoad}.json`)).default;
    return {
      locale: finalLocaleToLoad, // Return the locale that messages were loaded for
      messages: messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${finalLocaleToLoad}":`, error);

    // Fallback to default locale messages if the specific locale file failed (and wasn't already default)
    if (finalLocaleToLoad !== defaultLocale) {
      console.warn(`Attempting to load messages for default locale "${defaultLocale}" as a further fallback.`);
      try {
        const defaultMessages = (await import(`./messages/${defaultLocale}.json`)).default;
        return {
          locale: defaultLocale, // Return defaultLocale as this is what messages are for
          messages: defaultMessages
        };
      } catch (defaultError) {
        console.error(`FATAL: Failed to load messages for default locale "${defaultLocale}":`, defaultError);
        // Critical error: default messages also failed. Return default locale with empty messages.
        // This will likely cause UI to show translation keys instead of text.
        return { locale: defaultLocale, messages: {} };
      }
    }

    // If the initial attempt was for the defaultLocale and it failed.
    return { locale: defaultLocale, messages: {} };
  }
});
