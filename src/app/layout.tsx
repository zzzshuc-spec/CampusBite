import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteFooter } from "@/components/common/SiteFooter";

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
    default: "🍜 大学城美食地图",
    template: "%s · 🍜 大学城美食地图",
  },
  description:
    "面向学生群体的大学城美食发现平台，支持地图浏览、筛选推荐、收藏和对比。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
