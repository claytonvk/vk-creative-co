"use client"

import { useCallback, useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB")
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        const supabase = createClient()
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data, error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(fileName, file)

        if (uploadError) {
          throw uploadError
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(data.path)

        onChange(publicUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  return (
    <div className={cn("space-y-4", className)}>
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
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                Click to upload image
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF (max 10MB)
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
