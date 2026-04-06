import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/layout/bottom-nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Satış Takip | Esnaf Dashboard",
  description:
    "Mobil öncelikli satış takip sistemi — ürün satışlarını kaydedin, ciro ve kâr/zarar bilançonuzu takip edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            className: "text-sm",
            duration: 1500,
          }}
        />
      </body>
    </html>
  );
}
