import { NextRequest, NextResponse } from "next/server"
import { getGalleryMediaById } from "@/lib/queries/galleries"
import { trackMediaDownload } from "@/lib/actions/gallery-analytics"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { mediaId } = await params
    const media = await getGalleryMediaById(mediaId)

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      )
    }

    // Check if gallery is published and allows downloads
    const gallery = media.client_galleries as {
      is_published: boolean
      allow_downloads: boolean
    }

    if (!gallery?.is_published) {
      return NextResponse.json(
        { error: "Gallery not available" },
        { status: 403 }
      )
    }

    if (!gallery?.allow_downloads) {
      return NextResponse.json(
        { error: "Downloads not allowed" },
        { status: 403 }
      )
    }

    // Track the download
    await trackMediaDownload(media.gallery_id, mediaId)

    // Fetch the file
    const response = await fetch(media.file_url)
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 }
      )
    }

    const blob = await response.blob()

    // Return the file with proper headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${media.filename}"`,
        "Content-Length": blob.size.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    )
  }
}
