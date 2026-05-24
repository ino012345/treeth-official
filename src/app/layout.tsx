import type { Metadata } from "next";
// Use the local `geist` npm package instead of next/font/google to avoid
// build-time network requests to Google Fonts.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "treeth — コーポレートサイト・LP制作",
  description:
    "店舗・企業向けのコーポレートサイト・LP制作を手がけるWeb制作チーム treeth のポートフォリオ兼コーポレートサイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
