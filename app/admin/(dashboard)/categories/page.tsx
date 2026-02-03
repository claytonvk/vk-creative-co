"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { DeleteDialog } from "@/components/admin/delete-dialog"
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
import { Pencil, Trash2 } from "lucide-react"
import type { Category } from "@/lib/supabase/types"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      toast.error("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingCategory(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      display_order: categories.length,
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      display_order: category.display_order,
    })
    setIsDialogOpen(true)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("name", formData.name)
    form.append("slug", formData.slug || generateSlug(formData.name))
    form.append("description", formData.description)
    form.append("display_order", String(formData.display_order))

    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Category updated")
      } else {
        const result = await createCategory(form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Category created")
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
      const result = await deleteCategory(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Category deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const columns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    {
      key: "description",
      header: "Description",
      cell: (item: Category) =>
        item.description ? (
          <span className="line-clamp-1 max-w-xs">{item.description}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    { key: "display_order", header: "Order" },
    {
      key: "actions",
      header: "",
      cell: (item: Category) => (
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
        title="Categories"
        description="Manage portfolio categories"
        action={{ label: "Add Category", onClick: openCreateDialog }}
      />

      <DataTable columns={columns} data={categories} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingCategory ? formData.slug : generateSlug(e.target.value),
                  })
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generated-from-name"
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
              />
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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? Portfolio images in this category will become uncategorized."
      />
    </div>
  )
}
