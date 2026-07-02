import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from "@/lib/supabase/server";
import { CopyEmbedButton } from "@/components/copy-embed-button";
import { AddTestimonialDialog } from "@/components/add-testimonial-dialog";
import { DashboardTestimonialCard } from "@/components/dashboard-testimonial-card";
import { signOutAction } from '@/app/actions';

export const dynamic = "force-dynamic"; // Ensure fresh data on reload

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq('user_id', user.id)
    .order("created_at", { ascending: false });

  const displayTestimonials = testimonials || [];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-semibold text-lg text-gray-900 tracking-tight">App</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-gray-700" />
            My Wall
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md text-sm font-medium transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-500" />
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Wall of Love</h1>
          
          <div className="flex items-center gap-2">
            <CopyEmbedButton userId={user.id} />
            <AddTestimonialDialog />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {displayTestimonials.length === 0 ? (
              <div className="col-span-full h-56 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center bg-white/50 text-gray-500 gap-2">
                <p>No testimonials yet.</p>
                <span className="text-sm">Click "New Testimonial" to add your first one</span>
              </div>
            ) : (
              displayTestimonials.map((t) => (
                <DashboardTestimonialCard key={t.id} t={t} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
