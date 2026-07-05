import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { updateProfile } from "@/app/actions";

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
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 flex items-center px-8 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Settings</h1>
        </header>

        <div className="flex-1 p-8 overflow-auto bg-[#fafafa]">
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and public profile.
                </p>
              </div>
              
              <div className="p-6">
                <form action={updateProfile} className="space-y-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      defaultValue={profile?.full_name || ''}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      defaultValue={profile?.website || ''}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
