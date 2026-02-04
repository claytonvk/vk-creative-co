"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Loader2, CheckSquare } from "lucide-react"

interface GallerySelectionBarProps {
  selectedCount: number
  totalCount: number
  selectedIds: string[]
  galleryId: string
  galleryName: string
  onSelectAll: () => void
  onClearSelection: () => void
}

export function GallerySelectionBar({
  selectedCount,
  totalCount,
  selectedIds,
  galleryId,
  galleryName,
  onSelectAll,
  onClearSelection,
}: GallerySelectionBarProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadSelected = async () => {
    if (selectedIds.length === 0) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/gallery/download-selected/${galleryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaIds: selectedIds }),
      })

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${galleryName.replace(/[^a-z0-9]/gi, "_")}_selected.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onClearSelection()
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const allSelected = selectedCount === totalCount

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!allSelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Select All
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleDownloadSelected}
            disabled={isDownloading || selectedCount === 0}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Selected
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
