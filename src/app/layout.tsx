import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Unified ET Task Calendar",
  description: "감사 참여팀 통합 업무 캘린더 — Audit Engagement Task Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
