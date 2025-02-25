import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from '@/components/providers/Web3Provider';
import { Toaster } from 'sonner';
import { DragAndDropProvider } from '@/components/providers/DragAndDropProvider';
import { Header } from '@/components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonic AI Dashboard",
  description: "Advanced blockchain trading and monitoring platform powered by Sonic",
  keywords: "blockchain, trading, cryptocurrency, sonic, web3, defi",
  authors: [{ name: "Sonic Blockchain Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <Web3Provider>
          <DragAndDropProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster position="top-right" expand={true} richColors />
          </DragAndDropProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
