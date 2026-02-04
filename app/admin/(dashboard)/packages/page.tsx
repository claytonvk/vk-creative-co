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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import type { InvestmentPackage } from "@/lib/supabase/types"
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "@/lib/actions/packages"

export default function PackagesPage() {
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<InvestmentPackage | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    price_display: "",
    description: "",
    features: [] as string[],
    display_order: 0,
    is_featured: false,
    is_published: true,
    badge_text: "",
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getPackages()
      setPackages(data)
    } catch (error) {
      toast.error("Failed to load packages")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingPackage(null)
    setFormData({
      name: "",
      price: 0,
      price_display: "",
      description: "",
      features: [],
      display_order: packages.length,
      is_featured: false,
      is_published: true,
      badge_text: "",
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(pkg: InvestmentPackage) {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      price: pkg.price / 100, // Convert cents to dollars for display
      price_display: pkg.price_display || "",
      description: pkg.description || "",
      features: Array.isArray(pkg.features) ? (pkg.features as string[]) : [],
      display_order: pkg.display_order,
      is_featured: pkg.is_featured,
      is_published: pkg.is_published,
      badge_text: pkg.badge_text || "",
    })
    setIsDialogOpen(true)
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  function removeFeature(index: number) {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Convert dollars to cents for storage
    const priceInCents = Math.round(formData.price * 100)

    const form = new FormData()
    form.append("name", formData.name)
    form.append("price", String(priceInCents))
    form.append("price_display", formData.price_display)
    form.append("description", formData.description)
    form.append("features", JSON.stringify(formData.features))
    form.append("display_order", String(formData.display_order))
    form.append("is_featured", String(formData.is_featured))
    form.append("is_published", String(formData.is_published))
    form.append("badge_text", formData.badge_text)

    try {
      if (editingPackage) {
        const result = await updatePackage(editingPackage.id, form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Package updated")
      } else {
        const result = await createPackage(form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Package created")
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
      const result = await deletePackage(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Package deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  function formatPrice(cents: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "price",
      header: "Price",
      cell: (item: InvestmentPackage) =>
        item.price_display || formatPrice(item.price),
    },
    {
      key: "features",
      header: "Features",
      cell: (item: InvestmentPackage) => {
        const features = Array.isArray(item.features)
          ? (item.features as string[])
          : []
        return `${features.length} features`
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (item: InvestmentPackage) => (
        <div className="flex gap-1">
          {item.badge_text && <Badge variant="secondary">{item.badge_text}</Badge>}
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
      cell: (item: InvestmentPackage) => (
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
        title="Investment Packages"
        description="Manage your pricing packages"
        action={{ label: "Add Package", onClick: openCreateDialog }}
      />

      <DataTable columns={columns} data={packages} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add Package"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge_text">Badge Text</Label>
                <Input
                  id="badge_text"
                  value={formData.badge_text}
                  onChange={(e) =>
                    setFormData({ ...formData, badge_text: e.target.value })
                  }
                  placeholder="e.g., Most Popular"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_display">Display Price</Label>
                <Input
                  id="price_display"
                  value={formData.price_display}
                  onChange={(e) =>
                    setFormData({ ...formData, price_display: e.target.value })
                  }
                  placeholder="e.g., Starting at $2,500"
                />
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
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-muted px-3 py-2"
                  >
                    <span className="flex-1">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
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
                {editingPackage ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone."
      />
    </div>
  )
}
