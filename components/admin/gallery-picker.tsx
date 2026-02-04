"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { getGalleries, getGallery } from "@/lib/actions/galleries"
import type { ClientGallery, GalleryMedia } from "@/lib/supabase/types"

type GalleryListItem = ClientGallery & {
  gallery_media: { count: number }[]
}

interface GalleryPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (items: { gallery_id: string; gallery_media_id: string; file_url: string }[]) => void
  excludeMediaIds?: string[]
}

export function GalleryPicker({
  open,
  onOpenChange,
  onSelect,
  excludeMediaIds = [],
}: GalleryPickerProps) {
  const [galleries, setGalleries] = useState<GalleryListItem[]>([])
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>("")
  const [galleryMedia, setGalleryMedia] = useState<GalleryMedia[]>([])
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set())
  const [isLoadingGalleries, setIsLoadingGalleries] = useState(false)
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)

  useEffect(() => {
    if (open) {
      loadGalleries()
      setSelectedGalleryId("")
      setGalleryMedia([])
      setSelectedMediaIds(new Set())
    }
  }, [open])

  async function loadGalleries() {
    setIsLoadingGalleries(true)
    try {
      const data = await getGalleries()
      setGalleries(data as GalleryListItem[])
    } catch (error) {
      toast.error("Failed to load galleries")
    } finally {
      setIsLoadingGalleries(false)
    }
  }

  async function handleGallerySelect(galleryId: string) {
    setSelectedGalleryId(galleryId)
    setSelectedMediaIds(new Set())
    setIsLoadingMedia(true)

    try {
      const data = await getGallery(galleryId)
      // Filter out already-linked media
      const filtered = (data.gallery_media || []).filter(
        (m: GalleryMedia) => !excludeMediaIds.includes(m.id)
      )
      setGalleryMedia(filtered)
    } catch (error) {
      toast.error("Failed to load gallery media")
    } finally {
      setIsLoadingMedia(false)
    }
  }

  function toggleMedia(mediaId: string) {
    setSelectedMediaIds((prev) => {
      const next = new Set(prev)
      if (next.has(mediaId)) {
        next.delete(mediaId)
      } else {
        next.add(mediaId)
      }
      return next
    })
  }

  function handleAdd() {
    const items = galleryMedia
      .filter((m) => selectedMediaIds.has(m.id))
      .map((m) => ({
        gallery_id: selectedGalleryId,
        gallery_media_id: m.id,
        file_url: m.file_url,
      }))
    onSelect(items)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Link Images from Gallery</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Select
            value={selectedGalleryId}
            onValueChange={handleGallerySelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a gallery..." />
            </SelectTrigger>
            <SelectContent>
              {galleries.map((gallery) => (
                <SelectItem key={gallery.id} value={gallery.id}>
                  {gallery.name} ({gallery.gallery_media?.[0]?.count ?? 0} images)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoadingMedia ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : galleryMedia.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {galleryMedia.map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => toggleMedia(media.id)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedMediaIds.has(media.id)
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img
                      src={media.file_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {selectedMediaIds.has(media.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                        <div className="rounded-full bg-primary p-1">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : selectedGalleryId ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No available images in this gallery.
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-muted-foreground">
                Select a gallery to browse images.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedMediaIds.size === 0}
          >
            Add {selectedMediaIds.size > 0 ? `${selectedMediaIds.size} Image${selectedMediaIds.size > 1 ? "s" : ""}` : "Selected"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
