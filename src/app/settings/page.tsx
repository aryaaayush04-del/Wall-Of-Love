import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { SettingsForm } from "@/components/settings-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 flex items-center px-8 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Settings</h1>
        </header>

        <div className="flex-1 p-8 overflow-auto bg-[#fafafa]">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information and public profile.
                </p>
              </div>
              
              <div className="p-6">
                <SettingsForm initialData={profile} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark modes.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
