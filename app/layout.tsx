import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DeskopNavbar from "@/components/desktop-nav-bar";
import MobileNavbar from "@/components/mobile-nav-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PennyMate",
  description:
    "PennyMate is your personal finance companion. Track expenses, manage budgets, and achieve your financial goals with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" bg-surface">
      <head>
        <meta name="apple-mobile-web-app-title" content="PennyMate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-primary flex flex-col`}
      >
        <DeskopNavbar />
        <main className="w-11/12 md:w-8/12 mx-auto grow mt-10 md:mt-10">
          <div>{children}</div>
        </main>
        <MobileNavbar />
      </body>
    </html>
  );
}
