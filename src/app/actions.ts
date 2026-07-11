"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { checkSubmissionRateLimit } from "@/lib/ratelimit"

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Revalidate all paths that display testimonials. */
function revalidateTestimonialPaths() {
  revalidatePath("/")
  revalidatePath("/embed/my-wall")
}

/**
 * Authenticate the calling user via the secure session cookie.
 *
 * IMPORTANT: This calls `getUser()` — NOT `getSession()` — so the JWT is
 * verified server-side against Supabase Auth.  Never accept a user_id from
 * the client; always derive it from this call.
 */
async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  return { supabase, user }
}

// ─── Dashboard Actions (authenticated, RLS-bound) ──────────────────────────

export async function addTestimonial(formData: FormData) {
  try {
    const { supabase, user } = await requireAuth()

    const name = formData.get("name") as string
    const handle = formData.get("handle") as string
    const text = formData.get("text") as string
    const rating = parseInt(formData.get("rating") as string, 10)
    const platform = formData.get("platform") as string
    const original_date = formData.get("original_date") as string
    const post_url = formData.get("post_url") as string

    const { error } = await supabase.from("testimonials").insert({
      name,
      handle: handle?.startsWith("@") ? handle : handle ? `@${handle}` : null,
      text,
      rating,
      platform: platform || null,
      original_date: original_date || null,
      post_url: post_url || null,
      user_id: user.id, // derived from session, never from client
      is_approved: true, // Owner-created testimonials are auto-approved
    })

    if (error) {
      console.error("Failed to insert testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in addTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const { supabase, user } = await requireAuth()

    // Scope to user_id as a backend guard in addition to RLS.
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to delete testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in deleteTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export type UpdateTestimonialData = {
  name?: string
  handle?: string
  text?: string
  rating?: number
  platform?: string
  original_date?: string
  post_url?: string
}

export async function updateTestimonial(
  id: string,
  data: UpdateTestimonialData
) {
  try {
    const { supabase, user } = await requireAuth()

    const payload = { ...data }
    if (payload.handle) {
      payload.handle = payload.handle.startsWith("@")
        ? payload.handle
        : `@${payload.handle}`
    }

    // Scope to user_id as a backend guard in addition to RLS.
    const { error } = await supabase
      .from("testimonials")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to update testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in updateTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function approveTestimonial(id: string) {
  try {
    const { supabase, user } = await requireAuth()

    // Scope to user_id — only the wall owner can approve their own testimonials.
    const { error } = await supabase
      .from("testimonials")
      .update({ is_approved: true })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to approve testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in approveTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function rejectTestimonial(id: string) {
  try {
    const { supabase, user } = await requireAuth()

    // Scope to user_id — only the wall owner can reject their own testimonials.
    const { error } = await supabase
      .from("testimonials")
      .update({ is_approved: false })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to reject testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in rejectTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  try {
    const { supabase, user } = await requireAuth()

    const fullName = formData.get("full_name") as string
    const website = formData.get("website") as string
    const widgetTitle = formData.get("widget_title") as string

    // Upsert keyed on user.id from session — never from client input.
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName || null,
        website: website || null,
        widget_title: widgetTitle || null,
      },
      { onConflict: "id" }
    )

    if (error) {
      console.error("Failed to update profile", error)
      return { error: error.message }
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in updateProfile:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

// ─── Public Submission (unauthenticated visitors) ───────────────────────────
//
// This action is called by unauthenticated visitors submitting a testimonial
// for a specific wall owner.  Because there is no session, we must use the
// admin client (service_role) to bypass RLS.
//
// The `userId` parameter identifies the wall owner receiving the testimonial,
// NOT the submitter — this is the one legitimate case where a user_id is
// accepted from the client (it's the wall owner's public ID, not the actor's).

export async function submitPublicTestimonial(
  formData: FormData,
  userId: string
) {
  try {
    // ── Honeypot check ─────────────────────────────────────────────────────
    // The "website_url" field is CSS-hidden and un-tabbable.  Real users
    // never see it; bots auto-fill it.  If it contains anything, silently
    // return a fake success so the bot thinks the submission went through.
    const honeypot = formData.get("website_url") as string
    if (honeypot) {
      return { success: true }
    }

    // ── Rate Limiting ──────────────────────────────────────────────────────
    const rateLimit = await checkSubmissionRateLimit();
    if (!rateLimit.allowed) {
      return { error: rateLimit.error };
    }

    const name = formData.get("name") as string
    const handle = formData.get("handle") as string
    const text = formData.get("text") as string
    const rating = parseInt(formData.get("rating") as string, 10)

    if (!name || !text || !userId) {
      return { error: "Missing required fields" }
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return { error: "Rating must be between 1 and 5" }
    }

    // Admin client — no user session available for public submissions.
    const supabase = createAdminClient()

    const { error } = await supabase.from("testimonials").insert({
      name,
      handle: handle?.startsWith("@") ? handle : handle ? `@${handle}` : null,
      text,
      rating,
      user_id: userId, // wall owner receiving the testimonial
      is_approved: false, // Require owner approval
    })

    if (error) {
      console.error("Failed to insert public testimonial", error)
      return { error: error.message }
    }

    revalidateTestimonialPaths()
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in submitPublicTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}
