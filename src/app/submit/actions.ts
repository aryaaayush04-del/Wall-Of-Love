"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

/**
 * Server Action: handles public testimonial form submissions.
 * Uses the service_role admin client to bypass RLS so that
 * unauthenticated visitors can submit testimonials.
 */
export async function submitTestimonial(formData: FormData) {
  try {
    const customer_name = formData.get("customer_name") as string
    const testimonial = formData.get("testimonial") as string
    const rating = parseInt(formData.get("rating") as string, 10)
    const user_id = formData.get("user_id") as string

    // Basic validation
    if (!customer_name || !testimonial || !user_id) {
      return { error: "Missing required fields (customer_name, testimonial, user_id)" }
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return { error: "Rating must be a number between 1 and 5" }
    }

    const supabase = createAdminClient()

    const { error } = await supabase.from("testimonials").insert({
      name: customer_name,
      text: testimonial,
      rating,
      user_id,
    })

    if (error) {
      console.error("Failed to insert testimonial:", error)
      return { error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/embed/my-wall")
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in submitTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}
