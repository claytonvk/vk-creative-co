"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"

// Generate a URL-friendly slug from a title
function generateSlugBase(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "shoot"
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlugBase(title)
  let slug = baseSlug
  let counter = 0

  while (true) {
    let query = supabase
      .from("portfolio_shoots")
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

function revalidateShootPaths(shootId?: string) {
  revalidatePath("/admin/portfolio")
  revalidatePath("/portfolio")
  revalidatePath("/")
  if (shootId) {
    revalidatePath(`/admin/portfolio/${shootId}`)
    revalidatePath(`/admin/portfolio/${shootId}/media`)
  }
}

export async function getShoots() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("portfolio_shoots")
    .select("*, shoot_media(count), shoot_gallery_links(count), shoot_tags(*, categories(name, slug))")
    .order("display_order", { ascending: true })

  if (error) throw error
  return data
}

export async function getShoot(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("portfolio_shoots")
    .select("*, shoot_media(*), shoot_gallery_links(*, gallery_media(*)), shoot_tags(*, categories(*))")
    .eq("id", id)
    .single()

  if (error) throw error

  // Sort media by display_order
  if (data.shoot_media) {
    data.shoot_media.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
  }
  if (data.shoot_gallery_links) {
    data.shoot_gallery_links.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
  }

  return data
}

export async function createShoot(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string | null
  const shoot_date = formData.get("shoot_date") as string | null
  const location = formData.get("location") as string | null

  const slug = await generateUniqueSlug(supabase, title)

  // Get current max display order
  const { data: existing } = await supabase
    .from("portfolio_shoots")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)

  const displayOrder = existing && existing.length > 0
    ? existing[0].display_order + 1
    : 0

  const { data, error } = await supabase
    .from("portfolio_shoots")
    .insert({
      title,
      slug,
      description: description || null,
      shoot_date: shoot_date || null,
      location: location || null,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths()
  return { data }
}

export async function updateShoot(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string | null
  const shoot_date = formData.get("shoot_date") as string | null
  const location = formData.get("location") as string | null
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") === "true"
  const cover_image_url = formData.get("cover_image_url") as string | null

  // Get current shoot to check if title changed
  const { data: currentShoot } = await supabase
    .from("portfolio_shoots")
    .select("title, slug")
    .eq("id", id)
    .single()

  let slug = currentShoot?.slug
  if (currentShoot && currentShoot.title !== title) {
    slug = await generateUniqueSlug(supabase, title, id)
  }

  const { data, error } = await supabase
    .from("portfolio_shoots")
    .update({
      title,
      slug,
      description: description || null,
      shoot_date: shoot_date || null,
      location: location || null,
      is_featured,
      is_published,
      cover_image_url: cover_image_url || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths(id)
  return { data }
}

export async function deleteShoot(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get all shoot media to delete from storage
  const { data: media } = await supabase
    .from("shoot_media")
    .select("file_url")
    .eq("shoot_id", id)

  // Delete shoot (cascade will delete media records, gallery links, and tags)
  const { error } = await supabase
    .from("portfolio_shoots")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  // Delete media files from storage
  if (media && media.length > 0) {
    const paths = media
      .map((m) => m.file_url.split("/portfolio/")[1])
      .filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from("portfolio").remove(paths)
    }
  }

  revalidateShootPaths()
  return { success: true }
}

export async function publishShoot(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_shoots")
    .update({ is_published: true })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths(id)
  return { data }
}

export async function unpublishShoot(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_shoots")
    .update({ is_published: false })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths(id)
  return { data }
}

// --- Shoot Media ---

export async function createShootMediaRecord(
  shootId: string,
  mediaData: {
    file_url: string
    file_type: string
    filename: string
    file_size: number
  }
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get current max display order across both uploaded and linked media
  const { data: existingMedia } = await supabase
    .from("shoot_media")
    .select("display_order")
    .eq("shoot_id", shootId)
    .order("display_order", { ascending: false })
    .limit(1)

  const { data: existingLinks } = await supabase
    .from("shoot_gallery_links")
    .select("display_order")
    .eq("shoot_id", shootId)
    .order("display_order", { ascending: false })
    .limit(1)

  const maxMedia = existingMedia?.[0]?.display_order ?? -1
  const maxLinks = existingLinks?.[0]?.display_order ?? -1
  const displayOrder = Math.max(maxMedia, maxLinks) + 1

  const { data, error } = await supabase
    .from("shoot_media")
    .insert({
      shoot_id: shootId,
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

  revalidateShootPaths(shootId)
  return { data }
}

export async function deleteShootMedia(mediaId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get media to delete from storage
  const { data: media } = await supabase
    .from("shoot_media")
    .select("file_url, shoot_id")
    .eq("id", mediaId)
    .single()

  if (!media) {
    return { error: "Media not found" }
  }

  // Delete from database
  const { error } = await supabase
    .from("shoot_media")
    .delete()
    .eq("id", mediaId)

  if (error) {
    return { error: error.message }
  }

  // Delete from storage
  const path = media.file_url.split("/portfolio/")[1]
  if (path) {
    await supabase.storage.from("portfolio").remove([path])
  }

  revalidateShootPaths(media.shoot_id)
  return { success: true }
}

// --- Gallery Links ---

export async function linkGalleryImages(
  shootId: string,
  links: { gallery_id: string; gallery_media_id: string }[]
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Get current max display order
  const { data: existingMedia } = await supabase
    .from("shoot_media")
    .select("display_order")
    .eq("shoot_id", shootId)
    .order("display_order", { ascending: false })
    .limit(1)

  const { data: existingLinks } = await supabase
    .from("shoot_gallery_links")
    .select("display_order")
    .eq("shoot_id", shootId)
    .order("display_order", { ascending: false })
    .limit(1)

  const maxMedia = existingMedia?.[0]?.display_order ?? -1
  const maxLinks = existingLinks?.[0]?.display_order ?? -1
  let displayOrder = Math.max(maxMedia, maxLinks) + 1

  const records = links.map((link) => ({
    shoot_id: shootId,
    gallery_id: link.gallery_id,
    gallery_media_id: link.gallery_media_id,
    display_order: displayOrder++,
  }))

  const { data, error } = await supabase
    .from("shoot_gallery_links")
    .insert(records)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths(shootId)
  return { data }
}

export async function unlinkGalleryImage(linkId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data: link } = await supabase
    .from("shoot_gallery_links")
    .select("shoot_id")
    .eq("id", linkId)
    .single()

  const { error } = await supabase
    .from("shoot_gallery_links")
    .delete()
    .eq("id", linkId)

  if (error) {
    return { error: error.message }
  }

  if (link) {
    revalidateShootPaths(link.shoot_id)
  }
  return { success: true }
}

// --- Reorder ---

export async function reorderShootMedia(
  shootId: string,
  orderedItems: { id: string; type: "media" | "link" }[]
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const updates = orderedItems.map((item, index) => {
    const table = item.type === "media" ? "shoot_media" : "shoot_gallery_links"
    return supabase
      .from(table)
      .update({ display_order: index })
      .eq("id", item.id)
  })

  await Promise.all(updates)

  revalidateShootPaths(shootId)
  return { success: true }
}

// --- Tags ---

export async function updateShootTags(shootId: string, categoryIds: string[]) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // Delete existing tags
  await supabase
    .from("shoot_tags")
    .delete()
    .eq("shoot_id", shootId)

  // Insert new tags
  if (categoryIds.length > 0) {
    const records = categoryIds.map((categoryId) => ({
      shoot_id: shootId,
      category_id: categoryId,
    }))

    const { error } = await supabase
      .from("shoot_tags")
      .insert(records)

    if (error) {
      return { error: error.message }
    }
  }

  revalidateShootPaths(shootId)
  return { success: true }
}

// --- Cover Image ---

export async function setShootCoverImage(shootId: string, url: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("portfolio_shoots")
    .update({ cover_image_url: url })
    .eq("id", shootId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidateShootPaths(shootId)
  return { data }
}
