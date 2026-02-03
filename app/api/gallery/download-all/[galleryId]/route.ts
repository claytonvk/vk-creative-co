import { NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import { getGalleryByToken } from "@/lib/queries/galleries"
import { trackBulkDownload } from "@/lib/actions/gallery-analytics"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  try {
    const { galleryId } = await params

    // Get gallery with media
    const supabase = await createClient()
    const { data: gallery, error } = await supabase
      .from("client_galleries")
      .select("*, gallery_media(*)")
      .eq("id", galleryId)
      .eq("is_published", true)
      .single()

    if (error || !gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    if (!gallery.allow_downloads || !gallery.allow_bulk_download) {
      return NextResponse.json(
        { error: "Bulk downloads not allowed" },
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

    const media = gallery.gallery_media || []

    if (media.length === 0) {
      return NextResponse.json(
        { error: "No media in gallery" },
        { status: 400 }
      )
    }

    // Limit bulk downloads to 50 files to prevent memory issues
    if (media.length > 50) {
      return NextResponse.json(
        { error: "Gallery too large for bulk download. Please download files individually." },
        { status: 400 }
      )
    }

    // Track the download
    await trackBulkDownload(galleryId)

    // Create ZIP file
    const zip = new JSZip()

    // Download all files and add to ZIP
    const downloadPromises = media.map(async (item: { file_url: string; filename: string }, index: number) => {
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
    const filename = `${safeName}_gallery.zip`

    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zipBlob.size.toString(),
      },
    })
  } catch (error) {
    console.error("Bulk download error:", error)
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    )
  }
}
