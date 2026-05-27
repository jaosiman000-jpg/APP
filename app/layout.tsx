import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { PageTransition } from "@/components/page-transition";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reconquista Magnética",
  description: "Tu jornada de reposicionamiento emocional",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Reconquista",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full bg-brand-bg`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-cream antialiased">
        <main className="flex-1 flex flex-col max-w-md mx-auto w-full relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <BottomNav />
        <Toaster theme="dark" closeButton position="top-center" />
      </body>
    </html>
  );
}
