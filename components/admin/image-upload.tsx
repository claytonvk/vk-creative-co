"use client"

import { useCallback, useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { compressImage, formatFileSize } from "@/lib/image-compression"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  /** Show compression toggle (default: true) */
  showCompressionToggle?: boolean
  /** Default compression state (default: true) */
  defaultCompressed?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
  showCompressionToggle = true,
  defaultCompressed = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionEnabled, setCompressionEnabled] = useState(defaultCompressed)
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null)

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, WebP, or GIF)")
        return
      }

      // Original size limit only applies when compression is off
      // Allow larger files when compression is enabled
      const maxSize = compressionEnabled ? 50 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`Image must be less than ${compressionEnabled ? "50MB" : "10MB"}`)
        return
      }

      setIsUploading(true)
      setError(null)
      setCompressionInfo(null)

      try {
        let fileToUpload = file
        let fileExt = file.name.split(".").pop()

        // Compress if enabled
        if (compressionEnabled) {
          const result = await compressImage(file, {
            quality: 0.85,
            maxWidth: 2400,
            maxHeight: 2400,
            format: "webp",
          })
          fileToUpload = result.file
          fileExt = "webp"
          setCompressionInfo(
            `Compressed: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${result.compressionRatio}% smaller)`
          )
        }

        const supabase = createClient()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data, error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(fileName, fileToUpload)

        if (uploadError) {
          throw uploadError
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(data.path)

        onChange(publicUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
        setCompressionInfo(null)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, compressionEnabled]
  )

  return (
    <div className={cn("space-y-4", className)}>
      {showCompressionToggle && !value && (
        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
          <div className="space-y-0.5">
            <Label htmlFor="compression-toggle" className="text-sm font-medium">
              Optimize for web
            </Label>
            <p className="text-xs text-muted-foreground">
              {compressionEnabled
                ? "Converts to WebP, resizes large images (max 2400px)"
                : "Uploads original file without changes"}
            </p>
          </div>
          <Switch
            id="compression-toggle"
            checked={compressionEnabled}
            onCheckedChange={setCompressionEnabled}
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded image"
            className="h-40 w-auto rounded-md object-cover"
          />
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label
          className={cn(
            "flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:border-primary hover:bg-muted/50",
            error && "border-destructive"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                {compressionEnabled ? "Compressing & uploading..." : "Uploading..."}
              </span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                Click to upload image
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF (max {compressionEnabled ? "50MB" : "10MB"})
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </label>
      )}
      {compressionInfo && (
        <p className="text-sm text-green-600 dark:text-green-400">{compressionInfo}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
