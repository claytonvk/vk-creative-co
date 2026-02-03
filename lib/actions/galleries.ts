"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { ClientGallery, GalleryMedia } from "@/lib/supabase/types"

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

  const { data, error } = await supabase
    .from("client_galleries")
    .insert({
      name,
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
  const access_mode = (formData.get("access_mode") as ClientGallery["access_mode"]) || "guest_link"
  const expires_at = formData.get("expires_at") as string | null
  const allow_downloads = formData.get("allow_downloads") === "true"
  const allow_bulk_download = formData.get("allow_bulk_download") === "true"
  const cover_image_url = formData.get("cover_image_url") as string | null

  const { data, error } = await supabase
    .from("client_galleries")
    .update({
      name,
      client_name,
      client_email,
      event_date: event_date || null,
      description: description || null,
      theme,
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
