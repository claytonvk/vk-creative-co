"use client"

import { Download, Play, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryMedia } from "@/lib/supabase/types"

interface GalleryGridProps {
  media: GalleryMedia[]
  onItemClick: (index: number) => void
  allowDownloads: boolean
  galleryId: string
  isSelectionMode?: boolean
  selectedIds?: Set<string>
  onToggleSelection?: (id: string) => void
  themeColor?: string
}

export function GalleryGrid({
  media,
  onItemClick,
  allowDownloads,
  galleryId,
  isSelectionMode = false,
  selectedIds = new Set(),
  onToggleSelection,
  themeColor = "#1a1a1a",
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

  const handleClick = (e: React.MouseEvent, index: number, itemId: string) => {
    if (isSelectionMode && onToggleSelection) {
      e.preventDefault()
      onToggleSelection(itemId)
    } else {
      onItemClick(index)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    onToggleSelection?.(itemId)
  }

  return (
    <div className="gallery-grid container mx-auto px-4 pb-12">
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {media.map((item, index) => {
          const isSelected = selectedIds.has(item.id)

          return (
            <div
              key={item.id}
              className={`group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden transition-all ${
                isSelected ? "ring-2 ring-offset-2" : ""
              }`}
              style={isSelected ? { "--tw-ring-color": themeColor } as React.CSSProperties : undefined}
              onClick={(e) => handleClick(e, index, item.id)}
            >
              {item.file_type === "video" ? (
                <div className="relative aspect-video bg-black">
                  <video
                    src={item.file_url}
                    className={`h-full w-full object-cover transition-opacity ${
                      isSelected ? "opacity-80" : ""
                    }`}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className=" bg-white/90 p-3">
                      <Play className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.file_url}
                  alt=""
                  className={`w-full transition-all duration-300 ${
                    isSelected ? "opacity-80" : "group-hover:scale-105"
                  }`}
                  loading="lazy"
                />
              )}

              {/* Selection checkbox */}
              {allowDownloads && (
                <button
                  type="button"
                  className={`absolute left-3 top-3 flex h-6 w-6 items-center justify-center  border-2 transition-all ${
                    isSelected
                      ? "text-white"
                      : "border-white bg-black/30 text-white opacity-0"
                  } ${isSelectionMode ? "opacity-100" : ""}`}
                  style={isSelected ? { borderColor: themeColor, backgroundColor: themeColor } : undefined}
                  onClick={(e) => handleCheckboxClick(e, item.id)}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              )}

              {/* Selected indicator overlay */}
              {isSelected && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: `${themeColor}15` }}
                />
              )}

              {/* Overlay with download button */}
              {allowDownloads && !isSelectionMode && (
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
          )
        })}
      </div>
    </div>
  )
}
