"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { ClientGalleryWithMedia } from "@/lib/supabase/types"

interface GalleryHeaderProps {
  gallery: ClientGalleryWithMedia
}

export function GalleryHeader({ gallery }: GalleryHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadAll = async () => {
    if (!gallery.allow_bulk_download) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/gallery/download-all/${gallery.id}`)
      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${gallery.name.replace(/[^a-z0-9]/gi, "_")}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const formattedDate = gallery.event_date
    ? new Date(gallery.event_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <header className="gallery-header">
      <div className="container mx-auto px-4 py-12 text-center md:py-16">
        <h1 className="gallery-title text-3xl font-light tracking-wide md:text-4xl lg:text-5xl">
          {gallery.name}
        </h1>

        {formattedDate && (
          <p className="gallery-date mt-3 text-sm tracking-widest uppercase opacity-70">
            {formattedDate}
          </p>
        )}

        {gallery.description && (
          <p className="gallery-description mx-auto mt-6 max-w-2xl text-base opacity-80">
            {gallery.description}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <p className="text-sm opacity-60">
            {gallery.gallery_media?.length || 0} photos
          </p>

          {gallery.allow_downloads && gallery.allow_bulk_download && (
            <Button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              variant="outline"
              className="gallery-button"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
