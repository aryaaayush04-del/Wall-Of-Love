"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="font-semibold text-lg text-gray-900 tracking-tight">App</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard className={`h-4 w-4 ${pathname === '/' ? 'text-gray-700' : 'text-gray-500'}`} />
          My Wall
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/settings' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className={`h-4 w-4 ${pathname === '/settings' ? 'text-gray-700' : 'text-gray-500'}`} />
          Settings
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4 text-gray-500" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
