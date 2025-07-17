// External imports
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Internal imports - Styles
import "./globals.css";

// Internal imports - Components
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Deal Analyzer - CRE Investment Analysis Platform",
  description: "Professional real estate investment analysis platform with instant calculators and comprehensive metrics for commercial real estate deals.",
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
        <ErrorBoundary>
          <main className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
