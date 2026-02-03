import { NextRequest, NextResponse } from "next/server"
import { createClient, isAdmin } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  // Check admin auth
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const galleryId = formData.get("galleryId") as string

    if (!file || !galleryId) {
      return NextResponse.json({ error: "Missing file or galleryId" }, { status: 400 })
    }

    const supabase = await createClient()

    // Upload to storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("galleries")
      .upload(fileName, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
