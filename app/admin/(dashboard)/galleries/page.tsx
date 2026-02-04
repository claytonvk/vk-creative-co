"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, Trash2, Copy, Eye, Images, ExternalLink } from "lucide-react"
import type { ClientGallery, GalleryTheme } from "@/lib/supabase/types"
import {
  getGalleries,
  createGallery,
  deleteGallery,
} from "@/lib/actions/galleries"

type GalleryWithCount = ClientGallery & {
  gallery_media: { count: number }[]
}

const themeLabels: Record<GalleryTheme, string> = {
  minimal: "Clean & Minimal",
  romantic: "Soft & Romantic",
  editorial: "Bold & Editorial",
}

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<GalleryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    client_name: "",
    client_email: "",
    event_date: "",
    description: "",
    theme: "minimal" as GalleryTheme,
    access_mode: "guest_link" as "guest_link" | "client_account",
    expires_at: "",
  })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getGalleries()
      setGalleries(data as GalleryWithCount[])
    } catch (error) {
      toast.error("Failed to load galleries")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setFormData({
      name: "",
      client_name: "",
      client_email: "",
      event_date: "",
      description: "",
      theme: "minimal",
      access_mode: "guest_link",
      expires_at: "",
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("name", formData.name)
    form.append("client_name", formData.client_name)
    form.append("client_email", formData.client_email)
    form.append("event_date", formData.event_date)
    form.append("description", formData.description)
    form.append("theme", formData.theme)
    form.append("access_mode", formData.access_mode)
    form.append("expires_at", formData.expires_at)

    try {
      const result = await createGallery(form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Gallery created")
      setIsDialogOpen(false)
      loadData()
      // Navigate to the new gallery
      if (result.data) {
        router.push(`/admin/galleries/${result.data.id}`)
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleDelete() {
    if (!deletingId) return

    try {
      const result = await deleteGallery(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Gallery deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  function copyGalleryLink(slug: string) {
    const url = `${window.location.origin}/gallery/${slug}`
    navigator.clipboard.writeText(url)
    toast.success("Gallery link copied to clipboard")
  }

  const columns = [
    {
      key: "cover",
      header: "",
      cell: (item: GalleryWithCount) => (
        <div className="h-12 w-16 overflow-hidden rounded bg-muted">
          {item.cover_image_url ? (
            <img
              src={item.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Images className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Gallery",
      cell: (item: GalleryWithCount) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.client_name}</div>
        </div>
      ),
    },
    {
      key: "theme",
      header: "Theme",
      cell: (item: GalleryWithCount) => themeLabels[item.theme],
    },
    {
      key: "media_count",
      header: "Media",
      cell: (item: GalleryWithCount) => (
        <span>{item.gallery_media?.[0]?.count || 0} files</span>
      ),
    },
    {
      key: "stats",
      header: "Stats",
      cell: (item: GalleryWithCount) => (
        <div className="text-sm text-muted-foreground">
          <div>{item.view_count} views</div>
          <div>{item.download_count} downloads</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: GalleryWithCount) => (
        <Badge variant={item.is_published ? "default" : "outline"}>
          {item.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: GalleryWithCount) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              copyGalleryLink(item.slug)
            }}
            title="Copy link"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {item.is_published && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`/gallery/${item.slug}`, "_blank")
              }}
              title="View gallery"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/galleries/${item.id}`)
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setDeletingId(item.id)
              setIsDeleteDialogOpen(true)
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Client Galleries"
        description="Manage photo/video galleries for your clients"
        action={{ label: "Create Gallery", onClick: openCreateDialog }}
      />

      <DataTable
        columns={columns}
        data={galleries}
        onRowClick={(item) => router.push(`/admin/galleries/${item.id}`)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Gallery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Gallery Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Smith Wedding"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) =>
                    setFormData({ ...formData, client_email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A note for your client..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="theme">Gallery Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value: GalleryTheme) =>
                    setFormData({ ...formData, theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Clean & Minimal</SelectItem>
                    <SelectItem value="romantic">Soft & Romantic</SelectItem>
                    <SelectItem value="editorial">Bold & Editorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_mode">Access Mode</Label>
                <Select
                  value={formData.access_mode}
                  onValueChange={(value: "guest_link" | "client_account") =>
                    setFormData({ ...formData, access_mode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest_link">Guest Link (No login)</SelectItem>
                    <SelectItem value="client_account">Require Client Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) =>
                  setFormData({ ...formData, expires_at: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave blank for no expiration
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Gallery</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Gallery"
        description="Are you sure you want to delete this gallery? All media files will also be deleted. This action cannot be undone."
      />
    </div>
  )
}
