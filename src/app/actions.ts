"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addTestimonial(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const handle = formData.get("handle") as string
    const text = formData.get("text") as string
    const rating = parseInt(formData.get("rating") as string, 10)
    
    const platform = formData.get("platform") as string
    const original_date = formData.get("original_date") as string
    const post_url = formData.get("post_url") as string

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return { error: "Unauthorized" }
    }

    const { error } = await supabase.from("testimonials").insert({
      name,
      handle: handle?.startsWith('@') ? handle : handle ? `@${handle}` : null,
      text,
      rating,
      platform: platform || null,
      original_date: original_date || null,
      post_url: post_url || null,
      user_id: user.id,
    })

    if (error) {
      console.error("Failed to insert testimonial", error)
      return { error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/embed/my-wall")
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in addTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("Failed to delete testimonial", error)
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/embed/my-wall")
  return { success: true }
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

export async function updateTestimonial(id: string, data: UpdateTestimonialData) {
  const supabase = await createClient()

  const payload = { ...data }
  if (payload.handle) {
    payload.handle = payload.handle.startsWith('@') ? payload.handle : `@${payload.handle}`
  }

  const { error } = await supabase.from("testimonials").update(payload).eq("id", id)

  if (error) {
    console.error("Failed to update testimonial", error)
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/embed/my-wall")
  return { success: true }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updateProfile(formData: FormData) {
  const fullName = formData.get("full_name") as string
  const website = formData.get("website") as string

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Unauthorized");
    return;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName || null,
    website: website || null,
  }, { onConflict: 'id' })

  if (error) {
    console.error("Failed to update profile", error)
    return;
  }

  revalidatePath("/settings")
}

export async function submitPublicTestimonial(formData: FormData, userId: string) {
  try {
    const name = formData.get("name") as string
    const handle = formData.get("handle") as string
    const text = formData.get("text") as string
    const rating = parseInt(formData.get("rating") as string, 10)
    
    const supabase = await createClient()

    const { error } = await supabase.from("testimonials").insert({
      name,
      handle: handle?.startsWith('@') ? handle : handle ? `@${handle}` : null,
      text,
      rating,
      user_id: userId,
    })

    if (error) {
      console.error("Failed to insert public testimonial", error)
      return { error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/embed/my-wall")
    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error in submitPublicTestimonial:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}
