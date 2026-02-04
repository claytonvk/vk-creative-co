import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import { trackBulkDownload } from "@/lib/actions/gallery-analytics"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  try {
    const { galleryId } = await params
    const { mediaIds } = await request.json()

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json(
        { error: "No media selected" },
        { status: 400 }
      )
    }

    // Limit to 50 files
    if (mediaIds.length > 50) {
      return NextResponse.json(
        { error: "Too many files selected. Please select 50 or fewer." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get gallery to verify permissions
    const { data: gallery, error: galleryError } = await supabase
      .from("client_galleries")
      .select("id, name, is_published, allow_downloads, expires_at")
      .eq("id", galleryId)
      .eq("is_published", true)
      .single()

    if (galleryError || !gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    if (!gallery.allow_downloads) {
      return NextResponse.json(
        { error: "Downloads not allowed for this gallery" },
        { status: 403 }
      )
    }

    // Check expiration
    if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Gallery has expired" },
        { status: 403 }
      )
    }

    // Get selected media items
    const { data: mediaItems, error: mediaError } = await supabase
      .from("gallery_media")
      .select("id, file_url, filename")
      .eq("gallery_id", galleryId)
      .in("id", mediaIds)

    if (mediaError || !mediaItems || mediaItems.length === 0) {
      return NextResponse.json(
        { error: "No valid media found" },
        { status: 404 }
      )
    }

    // Track the download
    await trackBulkDownload(galleryId)

    // Create ZIP file
    const zip = new JSZip()

    // Download all selected files and add to ZIP
    const downloadPromises = mediaItems.map(async (item, index) => {
      try {
        const response = await fetch(item.file_url)
        if (!response.ok) {
          console.error(`Failed to fetch ${item.filename}`)
          return
        }
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()

        // Use index prefix to ensure unique filenames
        const filename = `${String(index + 1).padStart(3, "0")}_${item.filename}`
        zip.file(filename, arrayBuffer)
      } catch (err) {
        console.error(`Error downloading ${item.filename}:`, err)
      }
    })

    await Promise.all(downloadPromises)

    // Generate ZIP
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    })

    // Create safe filename
    const safeName = gallery.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    const filename = `${safeName}_selected.zip`

    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zipBlob.size.toString(),
      },
    })
  } catch (error) {
    console.error("Selected download error:", error)
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    )
  }
}
