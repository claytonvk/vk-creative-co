"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { DeleteDialog } from "@/components/admin/delete-dialog"
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
import { Pencil, Trash2, Star } from "lucide-react"
import type { Testimonial } from "@/lib/supabase/types"
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions/testimonials"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quote: "",
    author_name: "",
    author_role: "",
    author_image_url: "",
    rating: 5,
    display_order: 0,
    is_featured: false,
    is_published: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast.error("Failed to load testimonials")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingTestimonial(null)
    setFormData({
      quote: "",
      author_name: "",
      author_role: "",
      author_image_url: "",
      rating: 5,
      display_order: testimonials.length,
      is_featured: false,
      is_published: true,
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(testimonial: Testimonial) {
    setEditingTestimonial(testimonial)
    setFormData({
      quote: testimonial.quote,
      author_name: testimonial.author_name,
      author_role: testimonial.author_role || "",
      author_image_url: testimonial.author_image_url || "",
      rating: testimonial.rating || 5,
      display_order: testimonial.display_order,
      is_featured: testimonial.is_featured,
      is_published: testimonial.is_published,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("quote", formData.quote)
    form.append("author_name", formData.author_name)
    form.append("author_role", formData.author_role)
    form.append("author_image_url", formData.author_image_url)
    form.append("rating", String(formData.rating))
    form.append("display_order", String(formData.display_order))
    form.append("is_featured", String(formData.is_featured))
    form.append("is_published", String(formData.is_published))

    try {
      if (editingTestimonial) {
        const result = await updateTestimonial(editingTestimonial.id, form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Testimonial updated")
      } else {
        const result = await createTestimonial(form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Testimonial created")
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
      const result = await deleteTestimonial(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Testimonial deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const columns = [
    {
      key: "quote",
      header: "Quote",
      cell: (item: Testimonial) => (
        <span className="line-clamp-2 max-w-md">{item.quote}</span>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (item: Testimonial) => (
        <div>
          <div className="font-medium">{item.author_name}</div>
          {item.author_role && (
            <div className="text-sm text-muted-foreground">
              {item.author_role}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      cell: (item: Testimonial) => (
        <div className="flex">
          {[...Array(item.rating || 0)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: Testimonial) => (
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
      cell: (item: Testimonial) => (
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
        title="Testimonials"
        description="Manage client testimonials"
        action={{ label: "Add Testimonial", onClick: openCreateDialog }}
      />

      <DataTable columns={columns} data={testimonials} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) =>
                  setFormData({ ...formData, quote: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author_name">Author Name</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({ ...formData, author_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_role">Author Role</Label>
                <Input
                  id="author_role"
                  value={formData.author_role}
                  onChange={(e) =>
                    setFormData({ ...formData, author_role: e.target.value })
                  }
                  placeholder="e.g., Bride, Business Owner"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={String(formData.rating)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} Star{num !== 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

            <div className="space-y-2">
              <Label htmlFor="author_image_url">Author Image URL</Label>
              <Input
                id="author_image_url"
                value={formData.author_image_url}
                onChange={(e) =>
                  setFormData({ ...formData, author_image_url: e.target.value })
                }
                placeholder="https://..."
              />
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
                {editingTestimonial ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  )
}
