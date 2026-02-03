"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { Client } from "@/lib/supabase/types"

export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getClient(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*, gallery_clients(gallery_id, client_galleries(name, is_published))")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createClientRecord(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null

  const { data, error } = await supabase
    .from("clients")
    .insert({
      email,
      name,
      phone: phone || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/clients")
  return { data }
}

export async function updateClient(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null

  const { data, error } = await supabase
    .from("clients")
    .update({
      email,
      name,
      phone: phone || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/clients")
  return { data }
}

export async function deleteClient(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/clients")
  return { success: true }
}

export async function inviteClientToGallery(galleryId: string, clientId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("gallery_clients")
    .insert({
      gallery_id: galleryId,
      client_id: clientId,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Client already has access to this gallery" }
    }
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${galleryId}`)
  return { data }
}

export async function removeClientFromGallery(galleryId: string, clientId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("gallery_clients")
    .delete()
    .eq("gallery_id", galleryId)
    .eq("client_id", clientId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/galleries/${galleryId}`)
  return { success: true }
}

export async function getGalleryClients(galleryId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("gallery_clients")
    .select("*, clients(*)")
    .eq("gallery_id", galleryId)

  if (error) throw error
  return data
}
