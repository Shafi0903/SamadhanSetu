import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SamadhanSetu | Collaborative Civic Innovation Platform",
  description:
    "A digital civic-tech platform bridging grassroots societal challenges with university talent and industry partners for sustainable, impact-driven solutions.",
};

import { ApiPrewarmer } from "@/components/common/ApiPrewarmer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-[#111827]">
        <ApiPrewarmer />
        {children}
      </body>
    </html>
  );
}
