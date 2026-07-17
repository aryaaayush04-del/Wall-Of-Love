"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-ledger text-paper flex-shrink-0 flex flex-col hidden md:flex border-r border-fade/20">
      <div className="h-16 flex items-center px-6 border-b border-fade/20">
        <span className="font-display font-medium text-lg tracking-tight">Wall of Love</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
            pathname === '/dashboard' 
              ? 'bg-paper/10 text-paper' 
              : 'text-paper/70 hover:bg-paper/5 hover:text-paper'
          }`}
        >
          <LayoutDashboard className={`h-4 w-4 ${pathname === '/dashboard' ? 'text-brass' : 'text-paper/50'}`} />
          My Wall
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
            pathname === '/settings' 
              ? 'bg-paper/10 text-paper' 
              : 'text-paper/70 hover:bg-paper/5 hover:text-paper'
          }`}
        >
          <Settings className={`h-4 w-4 ${pathname === '/settings' ? 'text-brass' : 'text-paper/50'}`} />
          Settings
        </Link>
      </nav>
      <div className="p-4 border-t border-fade/20">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-paper/70 hover:bg-rust/20 hover:text-rust rounded-sm text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
