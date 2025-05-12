// Import the Toaster component for displaying toast notifications
import { Toaster } from "@/components/ui/toaster";

// Import necessary modules from UploadThing for server-side rendering
// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes"; // ThemeProvider for handling light/dark mode
import localFont from "next/font/local"; // Utility for loading local fonts
// import { extractRouterConfig } from "uploadthing/server";
// import { fileRouter } from "./api/uploadthing/core"; // File router for handling file uploads
import "./globals.css"; // Global CSS styles
import ReactQueryProvider from "./ReactQueryProvider"; // Import the ReactQueryProvider component

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class" // Attribute to apply theme class to HTML elements
            defaultTheme="system" // Use the system's theme preference by default
            enableSystem // Enable automatic switching based on system theme
            disableTransitionOnChange // Disable transitions during theme change for better UX
          >
            {children}{" "}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
