"use client"

import { useState } from "react"
import { Download, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryMedia } from "@/lib/supabase/types"

interface GalleryGridProps {
  media: GalleryMedia[]
  onItemClick: (index: number) => void
  allowDownloads: boolean
  galleryId: string
}

export function GalleryGrid({
  media,
  onItemClick,
  allowDownloads,
  galleryId,
}: GalleryGridProps) {
  const handleDownload = async (e: React.MouseEvent, item: GalleryMedia) => {
    e.stopPropagation()

    try {
      const response = await fetch(`/api/gallery/download/${item.id}`)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = item.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="gallery-grid container mx-auto px-4 pb-12">
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
            onClick={() => onItemClick(index)}
          >
            {item.file_type === "video" ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={item.file_url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 p-3">
                    <Play className="h-6 w-6 text-black" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.file_url}
                alt=""
                className="w-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )}

            {/* Overlay with download button */}
            {allowDownloads && (
              <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => handleDownload(e, item)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
