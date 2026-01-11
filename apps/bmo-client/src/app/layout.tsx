import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { BMOHeader } from "@/components/layout/BMOHeader";
import { BMOFooter } from "@/components/layout/BMOFooter";

export const metadata: Metadata = {
  title: "Sign in - BMO",
  description: "Sign in to BMO Online Banking to manage your accounts, pay bills, and more.",
  icons: {
    icon: '/brands/bmo/favicon.ico',
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
        <BMOHeader />
        <main className="main">
          {children}
        </main>
        <BMOFooter />
      </body>
    </html>
  );
}
