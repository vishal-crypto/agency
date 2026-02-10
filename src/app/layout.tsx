import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/ui/CursorGlow";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Elevate Agency | Premium Digital Marketing Solutions",
  description: "Transform your digital presence with data-driven marketing strategies. We help ambitious brands scale through strategic digital marketing.",
  keywords: ["digital marketing", "marketing agency", "SEO", "performance marketing", "brand development"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans bg-zinc-950 text-white antialiased`}
      >
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
