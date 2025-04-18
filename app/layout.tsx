import type React from "react";
import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";

// Initialize the Chivo font
const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
  variable: "--font-chivo",
});

export const metadata: Metadata = {
  title: "Color Website",
  description: "A website where you can select and buy colors",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chivo.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
