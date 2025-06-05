import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n'; // Assuming i18n.ts is in src/

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // Or 'always' or 'never'
});

export default intlMiddleware;

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Root
    '/(en|es)/:path*', // Locale-specific paths
    // Add paths that should not be internationalized if needed,
    // e.g., '/api/:path*', '/_next/:path*', '/img/:path*', '/favicon.ico'
    // but for now, this covers root and locale-prefixed paths.
    // A common pattern to exclude static assets and API routes:
    // '/((?!api|_next/static|_next/image|assets|favicon.ico).*)'
  ]
};
