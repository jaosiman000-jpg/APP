'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, LifeBuoy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  // Hide on login, onboarding, root, and PDF reader page (/metodo/[id]/leer)
  const isHidden = 
    pathname === '/login' || 
    pathname === '/onboarding' || 
    pathname === '/' ||
    pathname.endsWith('/leer');

  if (isHidden) return null;

  const items = [
    { label: 'Inicio', icon: Home, href: '/inicio' },
    { label: 'Método', icon: BookOpen, href: '/metodo' },
    { label: 'SOS', icon: LifeBuoy, href: '/sos' },
    { label: 'Perfil', icon: User, href: '/perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border bg-brand-bg/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/inicio' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 text-xs transition-all duration-200 active:scale-[0.95] select-none",
                isActive ? "text-brand-gold font-semibold" : "text-brand-dim"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1 transition-transform duration-200", isActive && "scale-110")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
