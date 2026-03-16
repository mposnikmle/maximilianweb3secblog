import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maximiliansecurity.xyz"),
  title: {
    default: "MaximilianSecurity.xyz",
    template: "%s | MaximilianSecurity.xyz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/maxs-owl.PNG", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/maxs-owl.PNG",
  },
  description:
    "Professional insights on web development, Next.js, TypeScript, React, and modern technology. Learn from practical tutorials and in-depth guides.",
  keywords: [
    "web development",
    "nextjs",
    "typescript",
    "react",
    "blog",
    "programming",
    "tutorials",
  ],
  authors: [{ name: "Maximilian" }],
  creator: "Maximilian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maximiliansecurity.xyz",
    siteName: "MaximilianSecurity.xyz",
    title: "MaximilianSecurity.xyz",
    description:
      "Professional insights on web development, Next.js, TypeScript, React, and modern technology.",
    images: [
      {
        url: "/maxs-owl.PNG",
        width: 1200,
        height: 1200,
        alt: "Max's Owl - Your Blog Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle", // TODO: Change to your Twitter handle
    title: "MaximilianSecurity.xyz",
    description:
      "Professional insights on web development, Next.js, TypeScript, React, and modern technology.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
