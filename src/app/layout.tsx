import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "2026 世界杯预测 | World Cup Predictions",
    template: "%s | 世界杯预测",
  },
  description:
    "2026 美加墨世界杯足球赛预测平台。提交比分预测，争夺积分排名，与全球球迷一起竞猜！",
  keywords: ["世界杯", "World Cup", "2026", "预测", "足球", "竞猜"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0F0F1A]">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
