"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import * as tus from "tus-js-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import {
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  GripVertical,
  Loader2,
  Link2,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ShootWithMedia, ShootMedia, ShootGalleryLink, GalleryMedia } from "@/lib/supabase/types"
import {
  getShoot,
  deleteShootMedia,
  unlinkGalleryImage,
  reorderShootMedia,
  setShootCoverImage,
  createShootMediaRecord,
  linkGalleryImages,
} from "@/lib/actions/shoots"
import { compressImage, formatFileSize } from "@/lib/image-compression"
import { GalleryPicker } from "@/components/admin/gallery-picker"

type LinkedMedia = ShootGalleryLink & {
  gallery_media: GalleryMedia
}

// Unified media item for display
type MediaItem = {
  id: string
  type: "media" | "link"
  file_url: string
  display_order: number
  isCover: boolean
}

export default function ShootMediaPage() {
  const params = useParams()
  const router = useRouter()
  const shootId = params.id as string

  const [shoot, setShoot] = useState<ShootWithMedia | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [compressionStatus, setCompressionStatus] = useState("")
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false)

  useEffect(() => {
    loadShoot()
  }, [shootId])

  async function loadShoot() {
    try {
      const data = await getShoot(shootId)
      setShoot(data as ShootWithMedia)
    } catch (error) {
      toast.error("Failed to load shoot")
      router.push("/admin/portfolio")
    } finally {
      setIsLoading(false)
    }
  }

  // Build unified media list for display
  function getAllMedia(): MediaItem[] {
    if (!shoot) return []

    const items: MediaItem[] = []

    // Uploaded media
    for (const m of shoot.shoot_media || []) {
      items.push({
        id: m.id,
        type: "media",
        file_url: m.file_url,
        display_order: m.display_order,
        isCover: shoot.cover_image_url === m.file_url,
      })
    }

    // Linked gallery media
    for (const link of (shoot.shoot_gallery_links || []) as LinkedMedia[]) {
      if (link.gallery_media) {
        items.push({
          id: link.id,
          type: "link",
          file_url: link.gallery_media.file_url,
          display_order: link.display_order,
          isCover: shoot.cover_image_url === link.gallery_media.file_url,
        })
      }
    }

    items.sort((a, b) => a.display_order - b.display_order)
    return items
  }

  // Get already-linked gallery media IDs to exclude from picker
  function getLinkedMediaIds(): string[] {
    if (!shoot) return []
    return (shoot.shoot_gallery_links || []).map((l) => l.gallery_media_id)
  }

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)
      setUploadProgress(0)

      let completedFiles = 0
      let hasErrors = false

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("You must be logged in to upload files")
        setIsUploading(false)
        return
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ]
        if (!validTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`)
          hasErrors = true
          continue
        }

        const maxSize = compressionEnabled ? 50 * 1024 * 1024 : 20 * 1024 * 1024
        if (file.size > maxSize) {
          toast.error(`Image too large (max ${compressionEnabled ? "50MB" : "20MB"}): ${file.name}`)
          hasErrors = true
          continue
        }

        try {
          let fileToUpload = file
          let fileExt = file.name.split(".").pop()

          if (compressionEnabled) {
            setCompressionStatus(`Compressing ${file.name}...`)
            const result = await compressImage(file, {
              quality: 0.85,
              maxWidth: 2400,
              maxHeight: 2400,
              format: "webp",
            })
            fileToUpload = result.file
            fileExt = "webp"
            setCompressionStatus("")
          }

          const fileName = `shoots/${shootId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

          setCurrentFileName(file.name)
          setUploadProgress(0)

          const { data: { session: currentSession } } = await supabase.auth.getSession()

          await new Promise<void>((resolve, reject) => {
            const upload = new tus.Upload(fileToUpload, {
              endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
              retryDelays: [0, 3000, 5000, 10000, 20000],
              headers: {
                authorization: `Bearer ${currentSession?.access_token}`,
                "x-upsert": "true",
              },
              uploadDataDuringCreation: true,
              removeFingerprintOnSuccess: true,
              metadata: {
                bucketName: "portfolio",
                objectName: fileName,
                contentType: fileToUpload.type,
              },
              chunkSize: 6 * 1024 * 1024,
              onError: (error) => {
                reject(error)
              },
              onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = Math.round((bytesUploaded / bytesTotal) * 100)
                setUploadProgress(percentage)
              },
              onSuccess: () => {
                resolve()
              },
            })

            upload.findPreviousUploads().then((previousUploads) => {
              if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
              }
              upload.start()
            })
          })

          const { data: { publicUrl } } = supabase.storage
            .from("portfolio")
            .getPublicUrl(fileName)

          const result = await createShootMediaRecord(shootId, {
            file_url: publicUrl,
            file_type: "image",
            filename: file.name,
            file_size: fileToUpload.size,
          })

          if (result.error) {
            toast.error(`Failed to save ${file.name}: ${result.error}`)
            hasErrors = true
          } else {
            completedFiles++
          }
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`)
          hasErrors = true
        }
      }

      setIsUploading(false)
      setUploadProgress(0)
      setCurrentFileName("")
      setCompressionStatus("")

      if (completedFiles > 0) {
        toast.success(`Uploaded ${completedFiles} image${completedFiles > 1 ? "s" : ""}`)
      }

      loadShoot()
      e.target.value = ""
    },
    [shootId, compressionEnabled]
  )

  async function handleGallerySelect(items: { gallery_id: string; gallery_media_id: string; file_url: string }[]) {
    try {
      const links = items.map((item) => ({
        gallery_id: item.gallery_id,
        gallery_media_id: item.gallery_media_id,
      }))
      const result = await linkGalleryImages(shootId, links)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`Linked ${items.length} image${items.length > 1 ? "s" : ""}`)
      loadShoot()
    } catch (error) {
      toast.error("Failed to link images")
    }
  }

  async function handleDeleteMedia(item: MediaItem) {
    if (!confirm("Remove this image?")) return

    try {
      if (item.type === "media") {
        const result = await deleteShootMedia(item.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
      } else {
        const result = await unlinkGalleryImage(item.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
      }
      toast.success(item.type === "media" ? "Image deleted" : "Image unlinked")
      loadShoot()
    } catch (error) {
      toast.error("Failed to remove image")
    }
  }

  async function handleSetCover(url: string) {
    try {
      const result = await setShootCoverImage(shootId, url)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Cover image set")
      loadShoot()
    } catch (error) {
      toast.error("Failed to set cover image")
    }
  }

  function handleDragStart(e: React.DragEvent, itemId: string) {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId || !shoot) return

    const items = getAllMedia()
    const draggedIndex = items.findIndex((m) => m.id === draggedItem)
    const targetIndex = items.findIndex((m) => m.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder array
    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    // Save to database
    const orderedItems = items.map((m) => ({ id: m.id, type: m.type }))
    await reorderShootMedia(shootId, orderedItems)

    setDraggedItem(null)
    loadShoot()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!shoot) {
    return <div>Shoot not found</div>
  }

  const allMedia = getAllMedia()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/portfolio/${shootId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {shoot.title} - Media
          </h1>
          <p className="text-sm text-muted-foreground">
            {allMedia.length} images
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Upload new images directly to this shoot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border p-3 bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="shoot-compression" className="text-sm font-medium">
                Optimize images for web
              </Label>
              <p className="text-xs text-muted-foreground">
                {compressionEnabled
                  ? "Converts images to WebP, resizes large images (max 2400px)"
                  : "Uploads original files without changes"}
              </p>
            </div>
            <Switch
              id="shoot-compression"
              checked={compressionEnabled}
              onCheckedChange={setCompressionEnabled}
              disabled={isUploading}
            />
          </div>

          <label
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
              isUploading
                ? "cursor-not-allowed opacity-50"
                : "hover:border-primary hover:bg-muted/50"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 w-full px-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {compressionStatus || `Uploading: ${currentFileName}`}
                </span>
                <div className="w-full bg-muted  h-2">
                  <div
                    className="bg-primary h-2  transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}% complete
                </span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Images (JPEG, PNG, WebP, GIF) up to {compressionEnabled ? "50MB" : "20MB"}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </CardContent>
      </Card>

      {/* Link from Gallery Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Link from Gallery</CardTitle>
              <CardDescription>
                Include images from client galleries without duplicating files.
              </CardDescription>
            </div>
            <Button onClick={() => setIsGalleryPickerOpen(true)}>
              <Link2 className="mr-2 h-4 w-4" />
              Browse Galleries
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* All Images Grid */}
      {allMedia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Images</CardTitle>
            <CardDescription>
              Drag to reorder. Click the star to set as cover image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {allMedia.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`group relative aspect-square overflow-hidden border bg-muted ${
                    draggedItem === item.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  <img
                    src={item.file_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  {/* Cover badge */}
                  {item.isCover && (
                    <Badge className="absolute left-2 top-2">Cover</Badge>
                  )}

                  {/* Source badge */}
                  {item.type === "link" && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary">
                        <Link2 className="mr-1 h-3 w-3" />
                        Linked
                      </Badge>
                    </div>
                  )}

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetCover(item.file_url)}
                      title="Set as cover"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteMedia(item)}
                      title={item.type === "media" ? "Delete" : "Unlink"}
                    >
                      {item.type === "media" ? (
                        <Trash2 className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Drag handle */}
                  <div className="absolute right-2 top-2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-5 w-5 text-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <GalleryPicker
        open={isGalleryPickerOpen}
        onOpenChange={setIsGalleryPickerOpen}
        onSelect={handleGallerySelect}
        excludeMediaIds={getLinkedMediaIds()}
      />
    </div>
  )
}
