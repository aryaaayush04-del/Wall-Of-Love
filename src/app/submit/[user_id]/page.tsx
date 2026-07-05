import { createClient } from "@/lib/supabase/server";
import { SubmitTestimonialForm } from "@/components/submit-testimonial-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubmitTestimonialPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  
  const supabase = await createClient();

  // Fetch the user's profile to get their name
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq('id', user_id)
    .maybeSingle();

  if (error || !profile) {
    // If the user doesn't exist, we could return a 404, or just continue with a generic name.
    // Let's assume the user doesn't exist if there's no profile.
    // Actually, profiles are created on demand, but let's just proceed gracefully.
  }

  const name = profile?.full_name || "this user";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-900 dark:bg-black px-6 py-8 text-center border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Leave a review for {name}
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Your feedback is greatly appreciated.
            </p>
          </div>
          
          <div className="p-6 sm:p-8">
            <SubmitTestimonialForm userId={user_id} />
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Powered by Wall of Love
        </p>
      </div>
    </div>
  );
}
