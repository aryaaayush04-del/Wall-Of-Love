export const dynamic = "force-dynamic"; // Ensure fresh data on reload

import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CopyEmbedButton } from "@/components/copy-embed-button";
import { AddTestimonialDialog } from "@/components/add-testimonial-dialog";
import { DashboardTestimonialCard } from "@/components/dashboard-testimonial-card";
import { CopyCollectionLink } from "@/components/copy-collection-link";
import { Sidebar } from '@/components/sidebar';
import { signOutAction } from '@/app/actions';
export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Use admin client to bypass RLS for fetching the owner's own testimonials
  const adminSupabase = createAdminClient();

  const { data: testimonials, error: testimonialsError } = await adminSupabase
    .from("testimonials")
    .select("*")
    .eq('user_id', user.id)
    .order("created_at", { ascending: false });

  if (testimonialsError) {
    console.error("Dashboard: failed to fetch testimonials", testimonialsError);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq('id', user.id)
    .maybeSingle();

  const displayTestimonials = testimonials || [];

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Wall of Love</h1>
          
          <div className="flex items-center gap-2">
            <CopyEmbedButton userId={user.id} />
            <AddTestimonialDialog />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto bg-[#fafafa] dark:bg-gray-900/50">
          {profile?.full_name && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Hello, {profile.full_name}!
            </h2>
          )}
          
          <CopyCollectionLink userId={user.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {displayTestimonials.length === 0 ? (
              <div className="col-span-full h-56 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 gap-2">
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
