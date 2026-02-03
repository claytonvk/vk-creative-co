"use server"

import { createClient } from "@/lib/supabase/server"

export async function getGalleryByToken(token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("client_galleries")
    .select("*, gallery_media(*)")
    .eq("access_token", token)
    .eq("is_published", true)
    .single()

  if (error) {
    return null
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Sort media by display_order
  if (data.gallery_media) {
    data.gallery_media.sort((a, b) => a.display_order - b.display_order)
  }

  return data
}

export async function getClientGalleries(clientId: string) {
  const supabase = await createClient()

  // Get galleries where client has access via gallery_clients
  const { data: galleryLinks } = await supabase
    .from("gallery_clients")
    .select("gallery_id")
    .eq("client_id", clientId)

  if (!galleryLinks || galleryLinks.length === 0) {
    return []
  }

  const galleryIds = galleryLinks.map((link) => link.gallery_id)

  const { data: galleries } = await supabase
    .from("client_galleries")
    .select("*, gallery_media(count)")
    .in("id", galleryIds)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  return galleries || []
}

export async function getGalleryMediaById(mediaId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("gallery_media")
    .select("*, client_galleries(is_published, allow_downloads)")
    .eq("id", mediaId)
    .single()

  if (error) {
    return null
  }

  return data
}
