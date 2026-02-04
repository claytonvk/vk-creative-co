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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import type { Category, ShootCard } from "@/lib/supabase/types"
import {
  getShoots,
  createShoot,
  deleteShoot,
  publishShoot,
  unpublishShoot,
} from "@/lib/actions/shoots"
import { getCategories } from "@/lib/actions/categories"

export default function PortfolioPage() {
  const [shoots, setShoots] = useState<ShootCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shoot_date: "",
    location: "",
  })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [shootsData, categoriesData] = await Promise.all([
        getShoots(),
        getCategories(),
      ])
      setShoots(shootsData as ShootCard[])
      setCategories(categoriesData)
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setFormData({
      title: "",
      description: "",
      shoot_date: "",
      location: "",
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("title", formData.title)
    form.append("description", formData.description)
    form.append("shoot_date", formData.shoot_date)
    form.append("location", formData.location)

    try {
      const result = await createShoot(form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Shoot created")
      setIsDialogOpen(false)

      // Navigate to the new shoot's detail page
      if (result.data) {
        router.push(`/admin/portfolio/${result.data.id}`)
      } else {
        loadData()
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleDelete() {
    if (!deletingId) return

    try {
      const result = await deleteShoot(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Shoot deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleTogglePublish(shoot: ShootCard, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      const result = shoot.is_published
        ? await unpublishShoot(shoot.id)
        : await publishShoot(shoot.id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(shoot.is_published ? "Unpublished" : "Published")
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  function getMediaCount(shoot: ShootCard): number {
    const uploaded = shoot.shoot_media?.[0]?.count ?? 0
    const linked = shoot.shoot_gallery_links?.[0]?.count ?? 0
    return uploaded + linked
  }

  const columns = [
    {
      key: "cover",
      header: "Cover",
      cell: (item: ShootCard) => (
        item.cover_image_url ? (
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="h-12 w-16 rounded object-cover"
          />
        ) : (
          <div className="flex h-12 w-16 items-center justify-center rounded bg-muted">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "tags",
      header: "Tags",
      cell: (item: ShootCard) => (
        <div className="flex flex-wrap gap-1">
          {item.shoot_tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.categories?.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "images",
      header: "Images",
      cell: (item: ShootCard) => (
        <span className="text-muted-foreground">{getMediaCount(item)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: ShootCard) => (
        <div className="flex gap-1">
          {item.is_featured && <Badge variant="secondary">Featured</Badge>}
          <Badge variant={item.is_published ? "default" : "outline"}>
            {item.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: ShootCard) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleTogglePublish(item, e)
            }}
            title={item.is_published ? "Unpublish" : "Publish"}
          >
            {item.is_published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/portfolio/${item.id}`)
            }}
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
        title="Portfolio Shoots"
        description="Manage your portfolio shoots and sessions"
        action={{ label: "New Shoot", onClick: openCreateDialog }}
      />

      <DataTable
        columns={columns}
        data={shoots}
        onRowClick={(item) => router.push(`/admin/portfolio/${item.id}`)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Shoot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Clay + Ali"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the shoot"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shoot_date">Shoot Date</Label>
                <Input
                  id="shoot_date"
                  type="date"
                  value={formData.shoot_date}
                  onChange={(e) =>
                    setFormData({ ...formData, shoot_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Austin, TX"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Shoot</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Shoot"
        description="Are you sure you want to delete this shoot? All uploaded images will be removed. This action cannot be undone."
      />
    </div>
  )
}
