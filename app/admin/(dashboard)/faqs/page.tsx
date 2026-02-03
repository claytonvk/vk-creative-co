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
import { Pencil, Trash2 } from "lucide-react"
import type { FAQ } from "@/lib/supabase/types"
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from "@/lib/actions/faqs"

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    display_order: 0,
    is_published: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getFAQs()
      setFaqs(data)
    } catch (error) {
      toast.error("Failed to load FAQs")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingFaq(null)
    setFormData({
      question: "",
      answer: "",
      category: "",
      display_order: faqs.length,
      is_published: true,
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(faq: FAQ) {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      display_order: faq.display_order,
      is_published: faq.is_published,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const form = new FormData()
    form.append("question", formData.question)
    form.append("answer", formData.answer)
    form.append("category", formData.category)
    form.append("display_order", String(formData.display_order))
    form.append("is_published", String(formData.is_published))

    try {
      if (editingFaq) {
        const result = await updateFAQ(editingFaq.id, form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("FAQ updated")
      } else {
        const result = await createFAQ(form)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("FAQ created")
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
      const result = await deleteFAQ(deletingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("FAQ deleted")
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
      loadData()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const columns = [
    {
      key: "question",
      header: "Question",
      cell: (item: FAQ) => (
        <span className="line-clamp-2 max-w-md font-medium">{item.question}</span>
      ),
    },
    {
      key: "answer",
      header: "Answer",
      cell: (item: FAQ) => (
        <span className="line-clamp-2 max-w-md text-muted-foreground">
          {item.answer}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (item: FAQ) =>
        item.category ? (
          <Badge variant="outline">{item.category}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: FAQ) => (
        <Badge variant={item.is_published ? "default" : "outline"}>
          {item.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: FAQ) => (
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
        title="FAQs"
        description="Manage frequently asked questions"
        action={{ label: "Add FAQ", onClick: openCreateDialog }}
      />

      <DataTable columns={columns} data={faqs} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Booking, Pricing, Sessions"
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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingFaq ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  )
}
