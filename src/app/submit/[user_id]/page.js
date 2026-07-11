import { submitTestimonial } from "@/app/submit/actions";

export const metadata = {
  title: "Leave a Testimonial",
  description: "Share your experience and help others learn about this product.",
};

export default async function TestimonialPage({ params }) {
  // In Next.js 15+, params is a Promise — must be awaited
  const { user_id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Leave a Testimonial
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We&apos;d love to hear about your experience. Your feedback means a lot.
          </p>
        </div>

        {/* Form — action receives the Server Action directly */}
        <form action={submitTestimonial} className="flex flex-col gap-5">
          {/* Hidden: user_id bound from URL params — never exposed in client JS */}
          <input type="hidden" name="user_id" value={user_id} />

          {/* Hidden: default rating of 5 */}
          <input type="hidden" name="rating" value="5" />

          {/* Honeypot — invisible to humans, irresistible to bots */}
          <input
            type="text"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute w-0 h-0 opacity-0 -z-50 pointer-events-none overflow-hidden"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="customer_name"
              className="text-sm font-medium text-gray-700"
            >
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
              required
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Testimonial */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="testimonial"
              className="text-sm font-medium text-gray-700"
            >
              Your Testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              id="testimonial"
              name="testimonial"
              required
              rows={5}
              placeholder="Share what you loved about the product or service..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Submit Testimonial
          </button>
        </form>
      </div>
    </main>
  );
}
