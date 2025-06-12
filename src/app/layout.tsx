// Import the Toaster component for displaying toast notifications
import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

// next-intl imports
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server'; // Import getMessages

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | GoTogether", 
    default: "GoTogether", 
  },
  description: "The social media app for powernerds",
};

export default async function RootLayout({
  children,
  params, // params.locale is automatically passed by Next.js if route is /app/[locale]/...
           // but getLocale() is more general if locale isn't always in path params at this layout level
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  // Use params.locale if available and valid, otherwise fallback to getLocale()
  // This handles cases where this RootLayout might be used directly by a locale-specific route segment.
  // However, with `localePrefix: 'as-needed'` and middleware, `getLocale()` should be reliable.
  const locale = params?.locale || await getLocale();
  console.log("RootLayout - Determined locale:", locale); // Added console.log
  const messages = await getMessages(); // Uses the locale from getRequestConfig in i18n.ts

  return (
    <html lang={locale}> {/* Set lang attribute to the current locale */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="America/New_York" // Replace with your desired default timezone
        >
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ReactQueryProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
