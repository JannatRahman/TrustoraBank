
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "../redux/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trustora-bank.vercel.app"),
  title: {
    default: "Trustora Bank | Secure Digital Banking",
    template: "%s | Trustora Bank",
  },
  description:
    "Manage your accounts, transactions, deposits, withdrawals, and loans with Trustora Bank. Experience secure, convenient digital banking.",
  applicationName: "Trustora Bank",
  keywords: [
    "Trustora Bank",
    "digital banking",
    "online banking",
    "secure banking",
    "account management",
    "financial services",
    "money transfer",
    "bank deposits",
    "withdrawals",
    "personal loans",
    "commercial banking",
  ],
  authors: [{ name: "Trustora Financial Technologies" }],
  creator: "Trustora Bank",
  publisher: "Trustora Bank",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trustora-bank.vercel.app",
    siteName: "Trustora Bank",
    title: "Trustora Bank | Secure Digital Banking",
    description:
      "Manage your accounts, transactions, deposits, withdrawals, and loans with Trustora Bank. Experience secure, convenient digital banking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trustora Bank - Secure Digital Banking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trustora Bank | Secure Digital Banking",
    description:
      "Manage your accounts, transactions, deposits, withdrawals, and loans with Trustora Bank. Experience secure, convenient digital banking.",
    images: ["/og-image.png"],
    creator: "@TrustoraBank",
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
};


export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
