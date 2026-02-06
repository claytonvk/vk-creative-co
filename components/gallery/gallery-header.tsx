"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Loader2, CheckSquare, Square, Share2, Images, Check } from "lucide-react"
import type { ClientGalleryWithMedia } from "@/lib/supabase/types"

interface GalleryHeaderProps {
  gallery: ClientGalleryWithMedia
  isSelectionMode?: boolean
  onToggleSelectionMode?: () => void
  hasCoverHero?: boolean
  themeColor?: string
}

export function GalleryHeader({
  gallery,
  isSelectionMode = false,
  onToggleSelectionMode,
  hasCoverHero = false,
  themeColor = "#1a1a1a",
}: GalleryHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/gallery/${gallery.slug}`
    const shareData = {
      title: gallery.name,
      text: `Check out ${gallery.name}`,
      url: shareUrl,
    }

    // Try native share first (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User cancelled or error, fall through to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
      <div className={`container mx-auto px-4 text-center ${hasCoverHero ? "py-20" : "py-12 md:py-16"}`}>
        {/* Only show title if no hero */}
        {!hasCoverHero && (
          <h1 className="gallery-title text-3xl font-light tracking-wide md:text-4xl lg:text-5xl">
            {gallery.name}
          </h1>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <p className="text-sm opacity-60">
            {gallery.gallery_media?.length || 0} photos
          </p>

          <Button
            onClick={handleShare}
            variant="outline"
            className="gallery-button"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>

          {gallery.allow_downloads && (
            <Button
              onClick={onToggleSelectionMode}
              variant="outline"
              className="gallery-button"
              style={{
                borderColor: isSelectionMode ? themeColor : undefined,
                color: isSelectionMode ? themeColor : undefined,
              }}
            >
              {isSelectionMode ? (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Cancel Selection
                </>
              ) : (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Select Photos
                </>
              )}
            </Button>
          )}

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

          <Link href="/client">
            <Button variant="outline" className="gallery-button">
              <Images className="mr-2 h-4 w-4" />
              My Galleries
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
