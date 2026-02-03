"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import * as tus from "tus-js-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Image as ImageIcon,
  Video,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ClientGallery, GalleryMedia } from "@/lib/supabase/types"
import {
  getGallery,
  deleteGalleryMedia,
  reorderGalleryMedia,
  setCoverImage,
  createGalleryMediaRecord,
} from "@/lib/actions/galleries"

type GalleryWithMedia = ClientGallery & {
  gallery_media: GalleryMedia[]
}

export default function GalleryMediaPage() {
  const params = useParams()
  const router = useRouter()
  const galleryId = params.id as string

  const [gallery, setGallery] = useState<GalleryWithMedia | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  useEffect(() => {
    loadGallery()
  }, [galleryId])

  async function loadGallery() {
    try {
      const data = await getGallery(galleryId)
      // Sort media by display_order
      if (data.gallery_media) {
        data.gallery_media.sort((a: GalleryMedia, b: GalleryMedia) => a.display_order - b.display_order)
      }
      setGallery(data as GalleryWithMedia)
    } catch (error) {
      toast.error("Failed to load gallery")
      router.push("/admin/galleries")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)
      setUploadProgress(0)

      const totalFiles = files.length
      let completedFiles = 0
      let hasErrors = false

      // Verify auth before uploading
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("You must be logged in to upload files")
        setIsUploading(false)
        return
      }
      console.log("Auth session:", session.user.email)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "video/mp4",
          "video/quicktime",
          "video/webm",
        ]
        if (!validTypes.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`)
          hasErrors = true
          continue
        }

        // Validate file size (20MB for images, no limit for videos)
        if (!file.type.startsWith("video/") && file.size > 20 * 1024 * 1024) {
          toast.error(`Image too large (max 20MB): ${file.name}`)
          hasErrors = true
          continue
        }

        try {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
          const fileExt = file.name.split(".").pop()
          const fileName = `${galleryId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

          setCurrentFileName(file.name)
          setUploadProgress(0)

          console.log(`Starting upload: ${file.name} (${fileSizeMB} MB) to ${fileName}`)

          // Use TUS resumable upload for large files with progress tracking
          const { data: { session } } = await supabase.auth.getSession()

          await new Promise<void>((resolve, reject) => {
            const upload = new tus.Upload(file, {
              endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
              retryDelays: [0, 3000, 5000, 10000, 20000],
              headers: {
                authorization: `Bearer ${session?.access_token}`,
                "x-upsert": "true",
              },
              uploadDataDuringCreation: true,
              removeFingerprintOnSuccess: true,
              metadata: {
                bucketName: "galleries",
                objectName: fileName,
                contentType: file.type,
              },
              chunkSize: 6 * 1024 * 1024, // 6MB chunks
              onError: (error) => {
                console.error("TUS upload error:", error)
                reject(error)
              },
              onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = Math.round((bytesUploaded / bytesTotal) * 100)
                setUploadProgress(percentage)
              },
              onSuccess: () => {
                console.log("TUS upload complete:", fileName)
                resolve()
              },
            })

            // Check for previous uploads to resume
            upload.findPreviousUploads().then((previousUploads) => {
              if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
              }
              upload.start()
            })
          })

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("galleries")
            .getPublicUrl(fileName)

          // Create database record via server action
          const fileType = file.type.startsWith("video/") ? "video" : "image"
          const result = await createGalleryMediaRecord(galleryId, {
            file_url: publicUrl,
            file_type: fileType as "image" | "video",
            filename: file.name,
            file_size: file.size,
          })

          if (result.error) {
            toast.error(`Failed to save ${file.name}: ${result.error}`)
            hasErrors = true
          } else {
            toast.success(`Uploaded ${file.name}`)
          }

          completedFiles++
        } catch (error) {
          console.error("Upload error:", error)
          toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
          hasErrors = true
        }
      }

      setIsUploading(false)
      setUploadProgress(0)
      setCurrentFileName("")

      if (!hasErrors && completedFiles > 0) {
        toast.success(`Uploaded ${completedFiles} file${completedFiles > 1 ? "s" : ""}`)
      }

      loadGallery()
      // Reset input
      e.target.value = ""
    },
    [galleryId]
  )

  async function handleDeleteMedia(mediaId: string) {
    if (!confirm("Delete this file?")) return

    try {
      const result = await deleteGalleryMedia(mediaId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("File deleted")
      loadGallery()
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  async function handleSetCover(mediaUrl: string) {
    try {
      const result = await setCoverImage(galleryId, mediaUrl)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Cover image set")
      loadGallery()
    } catch (error) {
      toast.error("Failed to set cover image")
    }
  }

  function handleDragStart(e: React.DragEvent, mediaId: string) {
    setDraggedItem(mediaId)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  async function handleDrop(e: React.DragEvent, targetMediaId: string) {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetMediaId || !gallery) return

    const mediaItems = [...gallery.gallery_media]
    const draggedIndex = mediaItems.findIndex((m) => m.id === draggedItem)
    const targetIndex = mediaItems.findIndex((m) => m.id === targetMediaId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder array
    const [removed] = mediaItems.splice(draggedIndex, 1)
    mediaItems.splice(targetIndex, 0, removed)

    // Update state optimistically
    setGallery({ ...gallery, gallery_media: mediaItems })

    // Save to database
    const mediaIds = mediaItems.map((m) => m.id)
    await reorderGalleryMedia(galleryId, mediaIds)

    setDraggedItem(null)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!gallery) {
    return <div>Gallery not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/galleries/${galleryId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {gallery.name} - Media
          </h1>
          <p className="text-sm text-muted-foreground">
            {gallery.gallery_media?.length || 0} files
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Drag and drop or click to upload images and videos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors ${
              isUploading
                ? "cursor-not-allowed opacity-50"
                : "hover:border-primary hover:bg-muted/50"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 w-full px-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Uploading: {currentFileName}
                </span>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
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
                  Images (JPEG, PNG, WebP, GIF) up to 20MB, Videos (MP4, MOV, WebM) no size limit
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </CardContent>
      </Card>

      {gallery.gallery_media && gallery.gallery_media.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery Files</CardTitle>
            <CardDescription>
              Drag to reorder. Click the star to set as cover image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {gallery.gallery_media.map((media) => (
                <div
                  key={media.id}
                  className={`group relative aspect-square overflow-hidden rounded-lg border bg-muted ${
                    draggedItem === media.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, media.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, media.id)}
                >
                  {media.file_type === "video" ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <img
                      src={media.file_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}

                  {/* Cover badge */}
                  {gallery.cover_image_url === media.file_url && (
                    <Badge className="absolute left-2 top-2">Cover</Badge>
                  )}

                  {/* File type badge */}
                  <div className="absolute bottom-2 left-2">
                    {media.file_type === "video" ? (
                      <Badge variant="secondary">
                        <Video className="mr-1 h-3 w-3" />
                        Video
                      </Badge>
                    ) : null}
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetCover(media.file_url)}
                      title="Set as cover"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteMedia(media.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
