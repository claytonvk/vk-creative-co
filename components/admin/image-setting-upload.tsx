"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { uploadSiteImage } from "@/lib/actions/settings"
import { compressImage, formatFileSize } from "@/lib/image-compression"

interface ImageSettingUploadProps {
  settingKey: string
  label: string
  currentUrl: string | null
  onUpload: (url: string) => void
  description?: string
  aspectRatio?: string
  /** Show compression toggle (default: true) */
  showCompressionToggle?: boolean
  /** Default compression state (default: true) */
  defaultCompressed?: boolean
}

export function ImageSettingUpload({
  settingKey,
  label,
  currentUrl,
  onUpload,
  description,
  aspectRatio = "16/9",
  showCompressionToggle = true,
  defaultCompressed = true,
}: ImageSettingUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const [compressionEnabled, setCompressionEnabled] = useState(defaultCompressed)
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync previewUrl with currentUrl prop when it changes
  useEffect(() => {
    setPreviewUrl(currentUrl)
  }, [currentUrl])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setCompressionInfo(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const msg = "Please select an image file"
      setError(msg)
      toast.error(msg)
      return
    }

    // Allow larger files when compression is enabled
    const maxSize = compressionEnabled ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const msg = `Image must be less than ${compressionEnabled ? "50MB" : "10MB"}`
      setError(msg)
      toast.error(msg)
      return
    }

    // Show preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    // Upload
    setIsUploading(true)
    try {
      let fileToUpload = file

      // Compress if enabled
      if (compressionEnabled) {
        const result = await compressImage(file, {
          quality: 0.85,
          maxWidth: 2400,
          maxHeight: 2400,
          format: "webp",
        })
        fileToUpload = result.file
        setCompressionInfo(
          `Compressed: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${result.compressionRatio}% smaller)`
        )
      }

      const formData = new FormData()
      formData.append("file", fileToUpload)
      formData.append("settingKey", settingKey)

      console.log("Uploading image for setting:", settingKey)
      const result = await uploadSiteImage(formData)
      console.log("Upload result:", result)

      if (result.error) {
        setError(result.error)
        toast.error(result.error)
        setPreviewUrl(currentUrl)
        setCompressionInfo(null)
        return
      }

      if (result.url) {
        setPreviewUrl(result.url)
        onUpload(result.url)
        toast.success("Image uploaded successfully")
      }
    } catch (err) {
      console.error("Upload error:", err)
      const msg = "Upload failed - please try again"
      setError(msg)
      toast.error(msg)
      setPreviewUrl(currentUrl)
      setCompressionInfo(null)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(localPreview)
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setError(null)
    onUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {showCompressionToggle && !previewUrl && (
        <div className="flex items-center justify-between border p-3 bg-muted/30">
          <div className="space-y-0.5">
            <Label htmlFor={`compression-${settingKey}`} className="text-sm font-medium">
              Optimize for web
            </Label>
            <p className="text-xs text-muted-foreground">
              {compressionEnabled
                ? "Converts to WebP, resizes large images"
                : "Uploads original file without changes"}
            </p>
          </div>
          <Switch
            id={`compression-${settingKey}`}
            checked={compressionEnabled}
            onCheckedChange={setCompressionEnabled}
            disabled={isUploading}
          />
        </div>
      )}

      <div
        className={`relative border-2 border-dashed overflow-hidden transition-colors ${
          error
            ? "border-destructive/50"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        style={{ aspectRatio }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover"
              onError={() => {
                console.log("Image failed to load:", previewUrl)
                setPreviewUrl(null)
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Replace
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[120px]"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm">Click to upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {compressionInfo && (
        <p className="text-xs text-green-600 dark:text-green-400">{compressionInfo}</p>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
