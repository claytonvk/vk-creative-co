"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { ClientGallery, GalleryMedia } from "@/lib/supabase/types"

// Generate a URL-friendly slug from a name
function generateSlugBase(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Trim hyphens from ends
    || "gallery"
}

// Generate a unique slug by checking for collisions
async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlugBase(name)
  let slug = baseSlug
  let counter = 0

  while (true) {
    let query = supabase
      .from("client_galleries")
      .select("id")
      .eq("slug", slug)

    if (excludeId) {
      query = query.neq("id", excludeId)
    }

    const { data } = await query.single()

    if (!data) {
      return slug
    }

    counter++
    slug = `${baseSlug}-${counter}`
  }
}

// Link a gallery to a client account based on email
// Creates the client record if it doesn't exist
async function linkGalleryToClient(
  supabase: Awaited<ReturnType<typeof createClient>>,
  galleryId: string,
  clientEmail: string,
  clientName: string
) {
  // Find or create client record
  let { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("email", clientEmail)
    .single()

  if (!client) {
    // Create client record (without user_id - they'll link it when they sign up)
    const { data: newClient, error: createError } = await supabase
      .from("clients")
      .insert({ email: clientEmail, name: clientName })
      .select("id")
      .single()

    if (createError) {
      console.error("Failed to create client:", createError)
      return
    }
    client = newClient
  }

  if (!client) return

  // Remove any existing gallery_clients links for this gallery
  await supabase
    .from("gallery_clients")
    .delete()
    .eq("gallery_id", galleryId)

  // Create new link
  await supabase
    .from("gallery_clients")
    .insert({ gallery_id: galleryId, client_id: client.id })
}

export async function getGalleries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("client_galleries")
    .select("*, gallery_media(count)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getGallery(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("client_galleries")
    .select("*, gallery_media(*)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createGallery(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()
  const accessToken = nanoid(21)

  const name = formData.get("name") as string
  const client_name = formData.get("client_name") as string
  const client_email = formData.get("client_email") as string
  const event_date = formData.get("event_date") as string | null
  const description = formData.get("description") as string | null
  const theme = (formData.get("theme") as ClientGallery["theme"]) || "minimal"
  const access_mode = (formData.get("access_mode") as ClientGallery["access_mode"]) || "guest_link"
  const expires_at = formData.get("expires_at") as string | null
  const allow_downloads = formData.get("allow_downloads") !== "false"
  const allow_bulk_download = formData.get("allow_bulk_download") !== "false"

  // Generate a unique slug from the gallery name
  const slug = await generateUniqueSlug(supabase, name)

  const { data, error } = await supabase
    .from("client_galleries")
    .insert({
      name,
      slug,
      client_name,
      client_email,
      event_date: event_date || null,
      description: description || null,
      theme,
      access_mode,
      access_token: accessToken,
      expires_at: expires_at || null,
      allow_downloads,
      allow_bulk_download,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Link gallery to client account
  if (data) {
    await linkGalleryToClient(supabase, data.id, client_email, client_name)
  }

  revalidatePath("/admin/galleries")
  return { data }
}

export async function updateGallery(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const name = formData.get("name") as string
  const client_name = formData.get("client_name") as string
  const client_email = formData.get("client_email") as string
  const event_date = formData.get("event_date") as string | null
  const description = formData.get("description") as string | null
  const theme = (formData.get("theme") as ClientGallery["theme"]) || "minimal"
  const theme_color = formData.get("theme_color") as string | null
  const access_mode = (formData.get("access_mode") as ClientGallery["access_mode"]) || "guest_link"
  const expires_at = formData.get("expires_at") as string | null
  const allow_downloads = formData.get("allow_downloads") === "true"
  const allow_bulk_download = formData.get("allow_bulk_download") === "true"
  const cover_image_url = formData.get("cover_image_url") as string | null

  // Get current gallery to check if name/email changed
  const { data: currentGallery } = await supabase
    .from("client_galleries")
    .select("name, slug, client_email")
    .eq("id", id)
    .single()

  // Regenerate slug if name changed
  let slug = currentGallery?.slug
  if (currentGallery && currentGallery.name !== name) {
    slug = await generateUniqueSlug(supabase, name, id)
  }

  const emailChanged = currentGallery && currentGallery.client_email !== client_email

  const { data, error } = await supabase
    .from("client_galleries")
    .update({
      name,
      slug,
      client_name,
      client_email,
      event_date: event_date || null,
      description: description || null,
      theme,
      theme_color: theme_color || "#1a1a1a",
      access_mode,
      expires_at: expires_at || null,
      allow_downloads,
      allow_bulk_download,
      cover_image_url: cover_image_url || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Re-link gallery to client if email changed
  if (emailChanged) {
    await linkGalleryToClient(supabase, id, client_email, client_name)
  }

  revalidatePath("/admin/galleries")
  revalidatePath(`/admin/galleries/${id}`)
  return { data }
}

export async function deleteGallery(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get all media to delete from storage
  const { data: media } = await supabase
    .from("gallery_media")
    .select("file_url")
    .eq("gallery_id", id)

  // Delete gallery (cascade will delete media records)
  const { error } = await supabase
    .from("client_galleries")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  // Delete media files from storage
  if (media && media.length > 0) {
    const paths = media
      .map((m) => m.file_url.split("/galleries/")[1])
      .filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from("galleries").remove(paths)
    }
  }

  revalidatePath("/admin/galleries")
  return { success: true }
}

export async function uploadGalleryMedia(galleryId: string, file: File) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const fileExt = file.name.split(".").pop()
  const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("galleries")
    .upload(fileName, file)

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from("galleries")
    .getPublicUrl(uploadData.path)

  // Determine file type
  const fileType = file.type.startsWith("video/") ? "video" : "image"

  // Get current max display order
  const { data: existingMedia } = await supabase
    .from("gallery_media")
    .select("display_order")
    .eq("gallery_id", galleryId)
    .order("display_order", { ascending: false })
    .limit(1)

  const displayOrder = existingMedia && existingMedia.length > 0
    ? existingMedia[0].display_order + 1
    : 0

  // Insert media record
  const { data, error } = await supabase
    .from("gallery_media")
    .insert({
      gallery_id: galleryId,
      file_url: publicUrl,
      file_type: fileType,
      filename: file.name,
      file_size: file.size,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${galleryId}`)
  revalidatePath(`/admin/galleries/${galleryId}/media`)
  return { data, url: publicUrl }
}

// Create media record only (for client-side uploads)
export async function createGalleryMediaRecord(
  galleryId: string,
  mediaData: {
    file_url: string
    file_type: "image" | "video"
    filename: string
    file_size: number
  }
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get current max display order
  const { data: existingMedia } = await supabase
    .from("gallery_media")
    .select("display_order")
    .eq("gallery_id", galleryId)
    .order("display_order", { ascending: false })
    .limit(1)

  const displayOrder = existingMedia && existingMedia.length > 0
    ? existingMedia[0].display_order + 1
    : 0

  const { data, error } = await supabase
    .from("gallery_media")
    .insert({
      gallery_id: galleryId,
      file_url: mediaData.file_url,
      file_type: mediaData.file_type,
      filename: mediaData.filename,
      file_size: mediaData.file_size,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${galleryId}`)
  revalidatePath(`/admin/galleries/${galleryId}/media`)
  return { data }
}

export async function deleteGalleryMedia(mediaId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get media to delete from storage
  const { data: media } = await supabase
    .from("gallery_media")
    .select("file_url, gallery_id")
    .eq("id", mediaId)
    .single()

  if (!media) {
    return { error: "Media not found" }
  }

  // Delete from database
  const { error } = await supabase
    .from("gallery_media")
    .delete()
    .eq("id", mediaId)

  if (error) {
    return { error: error.message }
  }

  // Delete from storage
  const path = media.file_url.split("/galleries/")[1]
  if (path) {
    await supabase.storage.from("galleries").remove([path])
  }

  revalidatePath(`/admin/galleries/${media.gallery_id}`)
  revalidatePath(`/admin/galleries/${media.gallery_id}/media`)
  return { success: true }
}

export async function reorderGalleryMedia(galleryId: string, mediaIds: string[]) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Update display_order for each media
  const updates = mediaIds.map((id, index) =>
    supabase
      .from("gallery_media")
      .update({ display_order: index })
      .eq("id", id)
  )

  await Promise.all(updates)

  revalidatePath(`/admin/galleries/${galleryId}`)
  revalidatePath(`/admin/galleries/${galleryId}/media`)
  return { success: true }
}

export async function publishGallery(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("client_galleries")
    .update({ is_published: true })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/galleries")
  revalidatePath(`/admin/galleries/${id}`)
  return { data }
}

export async function unpublishGallery(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("client_galleries")
    .update({ is_published: false })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/galleries")
  revalidatePath(`/admin/galleries/${id}`)
  return { data }
}

export async function regenerateAccessToken(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()
  const newToken = nanoid(21)

  const { data, error } = await supabase
    .from("client_galleries")
    .update({ access_token: newToken })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${id}`)
  return { data }
}

// Backfill client records for all galleries that don't have them
export async function backfillGalleryClients() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get all galleries
  const { data: galleries, error: fetchError } = await supabase
    .from("client_galleries")
    .select("id, client_email, client_name")

  if (fetchError) {
    return { error: fetchError.message }
  }

  let linked = 0
  for (const gallery of galleries || []) {
    if (gallery.client_email) {
      await linkGalleryToClient(
        supabase,
        gallery.id,
        gallery.client_email,
        gallery.client_name || "Client"
      )
      linked++
    }
  }

  return { success: true, linked }
}

export async function setCoverImage(galleryId: string, mediaUrl: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("client_galleries")
    .update({ cover_image_url: mediaUrl })
    .eq("id", galleryId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${galleryId}`)
  return { data }
}
