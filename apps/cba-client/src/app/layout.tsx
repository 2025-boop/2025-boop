import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { CBAHeader } from "@/components/layout/CBAHeader";
import { CBAFooter } from "@/components/layout/CBAFooter";

export const metadata: Metadata = {
  title: "NetBank - Log on to NetBank - Commonwealth Bank",
  description: "Log on to NetBank - Enjoy simple and secure online banking from Commonwealth Bank",
  icons: {
    icon: '/brands/cba/favicon.png',
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
        <CBAHeader />
        <main className="main">
          {children}
        </main>
        <CBAFooter />
      </body>
    </html>
  );
}
