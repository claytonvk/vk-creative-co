"use client"

import { useState } from "react"
import type { ClientGalleryWithMedia } from "@/lib/supabase/types"
import { GalleryHero } from "./gallery-hero"
import { GalleryHeader } from "./gallery-header"
import { GalleryGrid } from "./gallery-grid"
import { GalleryLightbox } from "./gallery-lightbox"
import { GallerySelectionBar } from "./gallery-selection-bar"
import { MinimalTheme } from "./themes/minimal"
import { RomanticTheme } from "./themes/romantic"
import { EditorialTheme } from "./themes/editorial"

interface GalleryViewProps {
  gallery: ClientGalleryWithMedia
  portalType?: "admin" | "client"
}

export function GalleryView({ gallery, portalType }: GalleryViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const themeColor = gallery.theme_color || "#1a1a1a"

  const ThemeWrapper = {
    minimal: MinimalTheme,
    romantic: RomanticTheme,
    editorial: EditorialTheme,
  }[gallery.theme]

  const openLightbox = (index: number) => {
    if (!isSelectionMode) {
      setLightboxIndex(index)
    }
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

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)

    // Auto-enable selection mode when first item is selected
    if (newSelected.size > 0 && !isSelectionMode) {
      setIsSelectionMode(true)
    }
    // Auto-disable selection mode when all items are deselected
    if (newSelected.size === 0) {
      setIsSelectionMode(false)
    }
  }

  const selectAll = () => {
    if (gallery.gallery_media) {
      setSelectedIds(new Set(gallery.gallery_media.map(m => m.id)))
      setIsSelectionMode(true)
    }
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }

  return (
    <ThemeWrapper themeColor={themeColor}>
      {gallery.cover_image_url && (
        <GalleryHero
          coverUrl={gallery.cover_image_url}
          name={gallery.name}
          eventDate={gallery.event_date}
          themeColor={themeColor}
        />
      )}
      <GalleryHeader
        gallery={gallery}
        isSelectionMode={isSelectionMode}
        onToggleSelectionMode={() => {
          if (isSelectionMode) {
            clearSelection()
          } else {
            setIsSelectionMode(true)
          }
        }}
        hasCoverHero={!!gallery.cover_image_url}
        themeColor={themeColor}
        portalType={portalType}
      />
      <GalleryGrid
        media={gallery.gallery_media || []}
        onItemClick={openLightbox}
        allowDownloads={gallery.allow_downloads}
        galleryId={gallery.id}
        isSelectionMode={isSelectionMode}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        themeColor={themeColor}
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
      {gallery.allow_downloads && selectedIds.size > 0 && (
        <GallerySelectionBar
          selectedCount={selectedIds.size}
          totalCount={gallery.gallery_media?.length || 0}
          selectedIds={Array.from(selectedIds)}
          galleryId={gallery.id}
          galleryName={gallery.name}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          themeColor={themeColor}
        />
      )}
    </ThemeWrapper>
  )
}
