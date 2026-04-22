import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Good2Give Foundation Accounts",
  description:
    "The corporate giving portal that turns daily sales into community impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var c=localStorage.getItem('portalPrimaryColor');if(c){var r=document.documentElement.style;r.setProperty('--primary',c);r.setProperty('--ring',c);r.setProperty('--accent-foreground',c);r.setProperty('--sidebar-primary',c);r.setProperty('--sidebar-ring',c);}}catch(e){}})();` }} />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
