"use client"

import { useState } from "react"
import type { ClientGalleryWithMedia } from "@/lib/supabase/types"
import { GalleryHeader } from "./gallery-header"
import { GalleryGrid } from "./gallery-grid"
import { GalleryLightbox } from "./gallery-lightbox"
import { MinimalTheme } from "./themes/minimal"
import { RomanticTheme } from "./themes/romantic"
import { EditorialTheme } from "./themes/editorial"

interface GalleryViewProps {
  gallery: ClientGalleryWithMedia
}

export function GalleryView({ gallery }: GalleryViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const ThemeWrapper = {
    minimal: MinimalTheme,
    romantic: RomanticTheme,
    editorial: EditorialTheme,
  }[gallery.theme]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToNext = () => {
    if (lightboxIndex !== null && gallery.gallery_media) {
      setLightboxIndex((lightboxIndex + 1) % gallery.gallery_media.length)
    }
  }

  const goToPrevious = () => {
    if (lightboxIndex !== null && gallery.gallery_media) {
      setLightboxIndex(
        (lightboxIndex - 1 + gallery.gallery_media.length) %
          gallery.gallery_media.length
      )
    }
  }

  return (
    <ThemeWrapper>
      <GalleryHeader gallery={gallery} />
      <GalleryGrid
        media={gallery.gallery_media || []}
        onItemClick={openLightbox}
        allowDownloads={gallery.allow_downloads}
        galleryId={gallery.id}
      />
      {lightboxIndex !== null && gallery.gallery_media && (
        <GalleryLightbox
          media={gallery.gallery_media}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrevious={goToPrevious}
          allowDownloads={gallery.allow_downloads}
          galleryId={gallery.id}
        />
      )}
    </ThemeWrapper>
  )
}
