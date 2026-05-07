'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import ShoreClub from "@/components/ShoreClub";
import DirectIncentiveBar from "@/components/DirectIncentiveBar";

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <DirectIncentiveBar />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <ShoreClub />
      <footer className="bg-white py-12 text-center border-t border-coastal-beige">
        <p className="text-slate-400 text-sm font-light tracking-widest uppercase italic">Escape to the shore.</p>
      </footer>
    </>
  );
}
