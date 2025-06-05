import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n'; // Assuming i18n.ts is in src/

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // Or 'always' or 'never'
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)']
};
