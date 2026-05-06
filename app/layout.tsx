import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ShoreClub from "@/components/ShoreClub";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azure Sands | Coastal Minimalism",
  description: "Experience minimalism by the sea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-coastal-beige">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <ShoreClub />
        <footer className="bg-white py-12 text-center border-t border-coastal-beige">
          <p className="text-slate-400 text-sm font-light tracking-widest uppercase italic">Escape to the shore.</p>
        </footer>
      </body>
    </html>
  );
}
