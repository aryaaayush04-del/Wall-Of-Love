import { Star, User, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

// ─── SVG Icons (kept inline to avoid client-component dependencies) ──────────

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

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Explicit allowlist of public-safe columns.
 * NEVER include: email, internal_notes, ip_address, user_id, or any
 * column that is not intended for public display.
 */
const TESTIMONIAL_PUBLIC_COLUMNS =
  "id, name, handle, text, rating, platform, original_date, post_url, created_at" as const;

const PROFILE_PUBLIC_COLUMNS = "widget_title" as const;

/** Validates that a string looks like a UUID v4. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape of each testimonial after column stripping. */
type PublicTestimonial = {
  id: string;
  name: string;
  handle: string | null;
  text: string;
  rating: number;
  platform: string | null;
  original_date: string | null;
  post_url: string | null;
  created_at: string;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  // ── 1. Validate the user_id is a real UUID to prevent injection ──────────
  if (!user_id || !UUID_RE.test(user_id)) {
    notFound();
  }

  // ── 2. Create an admin client (service_role — bypasses RLS) ──────────────
  const supabase = createAdminClient();

  // ── 3. Fetch ONLY approved testimonials with explicit column allowlist ────
  const { data: testimonials, error: testimonialsError } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_PUBLIC_COLUMNS)
    .eq("user_id", user_id)
    .eq("is_approved", true) // ⛔ Never serve pending / rejected drafts
    .order("created_at", { ascending: false });

  if (testimonialsError) {
    console.error("Widget: failed to fetch testimonials", testimonialsError);
  }

  // ── 4. Fetch profile (widget_title only) ─────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_PUBLIC_COLUMNS)
    .eq("id", user_id)
    .maybeSingle();

  // ── 5. Build a sanitised array — guarantee no extra properties leak ──────
  const safeTestimonials: PublicTestimonial[] = (testimonials ?? []).map(
    (t) => ({
      id: t.id,
      name: t.name,
      handle: t.handle,
      text: t.text,
      rating: t.rating,
      platform: t.platform,
      original_date: t.original_date,
      post_url: t.post_url,
      created_at: t.created_at,
    })
  );

  // ── 6. Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>
        {
          "html, body { background: transparent !important; color-scheme: light !important; }"
        }
      </style>
      <div className="p-4 !bg-transparent min-h-screen">
        <h2 className="text-center mb-10 text-white font-extrabold text-2xl tracking-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
          {profile?.widget_title || "What people are saying"}
        </h2>

        {safeTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No testimonials found yet
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              When new testimonials are added to your wall of love, they will
              appear right here.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {safeTestimonials.map((t) => {
              // Format date cleanly if it exists
              let formattedDate: string | null = null;
              if (t.original_date) {
                try {
                  const date = new Date(t.original_date);
                  const timeZone = t.original_date.includes("T")
                    ? undefined
                    : "UTC";
                  formattedDate = date.toLocaleDateString("en-US", {
                    timeZone,
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                } catch {
                  // Ignore invalid dates
                }
              }

              // Determine platform icon
              let IconComponent: React.ComponentType<
                React.SVGProps<SVGSVGElement>
              > = MessageSquare;
              if (t.platform === "X/Twitter") IconComponent = TwitterIcon;
              if (t.platform === "LinkedIn") IconComponent = LinkedinIcon;

              const showPlatform = t.platform || t.post_url;
              const iconElement = (
                <IconComponent className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" />
              );

              const isClickable = Boolean(t.post_url);
              const CardWrapper: any = isClickable ? "a" : "div";
              const wrapperProps = isClickable
                ? { href: t.post_url, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <CardWrapper
                  key={t.id}
                  {...wrapperProps}
                  className={`relative break-inside-avoid bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md hover:border-gray-300 overflow-hidden block ${isClickable ? "group cursor-pointer" : ""}`}
                >
                  {isClickable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-white font-medium">
                        View Original Post
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {t.name}
                        </span>
                        {showPlatform && (
                          <span title={t.platform || "Platform"}>
                            {iconElement}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
                        {t.handle && (
                          <span className="truncate">{t.handle}</span>
                        )}
                        {t.handle && formattedDate && <span>•</span>}
                        {formattedDate && <span>{formattedDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {t.text}
                  </p>
                </CardWrapper>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
