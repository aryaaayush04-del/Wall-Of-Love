import { Star, User, MessageSquare } from 'lucide-react';

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EmbedWall(props: Props) {
  const searchParams = await props.searchParams;
  const userId = searchParams.user as string | undefined;

  const supabase = await createClient();
  
  let query = supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: testimonials } = await query;

  const displayTestimonials = testimonials || [];

  return (
    <>
      <style>{`
        body {
          background-color: transparent !important;
        }
      `}</style>
      <div className="p-4 bg-transparent min-h-screen">
        {displayTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No testimonials found yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">When new testimonials are added to your wall of love, they will appear right here.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayTestimonials.map((t) => {
              // Format date cleanly if it exists
              let formattedDate = null;
              if (t.original_date) {
                try {
                  const date = new Date(t.original_date);
                  // e.g. "Oct 12, 2023"
                  // Use UTC to prevent off-by-one errors from local timezone parsing if it's just a YYYY-MM-DD string
                  const timeZone = t.original_date.includes('T') ? undefined : 'UTC';
                  formattedDate = date.toLocaleDateString('en-US', { timeZone, month: 'short', day: 'numeric', year: 'numeric' });
                } catch (e) {
                  // Ignore invalid dates
                }
              }

              // Determine platform icon
              let IconComponent: any = MessageSquare;
              if (t.platform === 'X/Twitter') IconComponent = TwitterIcon;
              if (t.platform === 'LinkedIn') IconComponent = LinkedinIcon;

              const showPlatform = t.platform || t.post_url;
              const iconElement = <IconComponent className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" />;

              const isClickable = Boolean(t.post_url);
              const CardWrapper: any = isClickable ? 'a' : 'div';
              const wrapperProps = isClickable ? { href: t.post_url, target: '_blank', rel: 'noreferrer' } : {};

              return (
                <CardWrapper
                  key={t.id}
                  {...wrapperProps}
                  className={`relative break-inside-avoid bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md overflow-hidden block ${isClickable ? 'group cursor-pointer' : ''}`}
                >
                  {isClickable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-white font-medium">View Original Post</span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900 truncate">{t.name}</span>
                        {showPlatform && (
                          <span title={t.platform || 'Platform'}>{iconElement}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
                        {t.handle && <span className="truncate">{t.handle}</span>}
                        {t.handle && formattedDate && <span>•</span>}
                        {formattedDate && <span>{formattedDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{t.text}</p>
                </CardWrapper>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
