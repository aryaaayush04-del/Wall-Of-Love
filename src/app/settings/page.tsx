import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { SettingsForm } from "@/components/settings-form";

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
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-paper">
        <header className="h-16 flex items-center px-8 border-b border-fade/20 bg-paper">
          <h1 className="text-xl font-display font-medium text-ledger tracking-tight">Settings</h1>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div className="bg-paper rounded-[10px] border border-fade/20 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-fade/20">
                <h2 className="text-lg font-medium text-ledger">Profile Settings</h2>
                <p className="mt-1 text-[14px] text-fade">
                  Update your personal information and public profile.
                </p>
              </div>
              
              <div className="p-6">
                <SettingsForm initialData={profile} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
