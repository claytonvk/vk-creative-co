"use client"

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import type { GalleryMedia } from "@/lib/supabase/types"

interface GalleryLightboxProps {
  media: GalleryMedia[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  allowDownloads: boolean
  galleryId: string
}

export function GalleryLightbox({
  media,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  allowDownloads,
  galleryId,
}: GalleryLightboxProps) {
  const currentMedia = media[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
      }
    },
    [onClose, onNext, onPrevious]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/gallery/download/${currentMedia.id}`)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = currentMedia.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-10 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      {media.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Media content */}
      <div className="relative max-h-[90vh] max-w-[90vw]">
        {currentMedia.file_type === "video" ? (
          <video
            src={currentMedia.file_url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        ) : (
          <img
            src={currentMedia.file_url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <span className="text-sm text-white/70">
          {currentIndex + 1} / {media.length}
        </span>

        {allowDownloads && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </div>
  )
}
