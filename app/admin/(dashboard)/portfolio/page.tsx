"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Pencil, Trash2 } from "lucide-react"
import type { PortfolioImage, Category } from "@/lib/supabase/types"
import {
  getPortfolioImages,
  createPortfolioImage,
  updatePortfolioImage,
  deletePortfolioImage,
} from "@/lib/actions/portfolio"
import { getCategories } from "@/lib/actions/categories"

type PortfolioWithCategory = PortfolioImage & {
  categories: { name: string; slug: string } | null
}

export default function PortfolioPage() {
  const [images, setImages] = useState<PortfolioWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<PortfolioWithCategory | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category_id: "",
    display_order: 0,
    is_featured: false,
    is_published: true,
    alt_text: "",
  })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [imagesData, categoriesData] = await Promise.all([
        getPortfolioImages(),
        getCategories(),
      ])
      setImages(imagesData as PortfolioWithCategory[])
      setCategories(categoriesData)
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingImage(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category_id: "",
      display_order: images.length,
      is_featured: false,
      is_published: true,
      alt_text: "",
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(image: PortfolioWithCategory) {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      category_id: image.category_id || "",
      display_order: image.display_order,
      is_featured: image.is_featured,
      is_published: image.is_published,
      alt_text: image.alt_text || "",
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("title", formData.title)
    form.append("description", formData.description)
    form.append("image_url", formData.image_url)
    form.append("category_id", formData.category_id)
    form.append("display_order", String(formData.display_order))
    form.append("is_featured", String(formData.is_featured))
    form.append("is_published", String(formData.is_published))
    form.append("alt_text", formData.alt_text)

    try {
      if (editingImage) {
        const result = await updatePortfolioImage(editingImage.id, form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Image updated")
      } else {
        const result = await createPortfolioImage(form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Image created")
      }
      setIsDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleDelete() {
    if (!deletingId) return

    try {
      const result = await deletePortfolioImage(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Image deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const columns = [
    {
      key: "image",
      header: "Image",
      cell: (item: PortfolioWithCategory) => (
        <img
          src={item.image_url}
          alt={item.alt_text || item.title}
          className="h-12 w-16 rounded object-cover"
        />
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "category",
      header: "Category",
      cell: (item: PortfolioWithCategory) =>
        item.categories?.name || "Uncategorized",
    },
    {
      key: "status",
      header: "Status",
      cell: (item: PortfolioWithCategory) => (
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
      cell: (item: PortfolioWithCategory) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              openEditDialog(item)
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
        title="Portfolio"
        description="Manage your portfolio images"
        action={{ label: "Add Image", onClick: openCreateDialog }}
      />

      <DataTable columns={columns} data={images} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Edit Image" : "Add Image"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              onRemove={() => setFormData({ ...formData, image_url: "" })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) =>
                  setFormData({ ...formData, alt_text: e.target.value })
                }
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Published</Label>
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
              <Button type="submit">
                {editingImage ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
      />
    </div>
  )
}
