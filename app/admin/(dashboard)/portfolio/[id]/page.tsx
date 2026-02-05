"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react"
import type { Category, ShootWithMedia } from "@/lib/supabase/types"
import {
  getShoot,
  updateShoot,
  updateShootTags,
} from "@/lib/actions/shoots"
import { getCategories } from "@/lib/actions/categories"

export default function ShootDetailPage() {
  const params = useParams()
  const router = useRouter()
  const shootId = params.id as string

  const [shoot, setShoot] = useState<ShootWithMedia | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shoot_date: "",
    location: "",
    is_featured: false,
    is_published: false,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [shootId])

  async function loadData() {
    try {
      const [shootData, categoriesData] = await Promise.all([
        getShoot(shootId),
        getCategories(),
      ])
      setShoot(shootData as ShootWithMedia)
      setCategories(categoriesData)
      setFormData({
        title: shootData.title,
        description: shootData.description || "",
        shoot_date: shootData.shoot_date || "",
        location: shootData.location || "",
        is_featured: shootData.is_featured,
        is_published: shootData.is_published,
      })
      setSelectedTags(
        shootData.shoot_tags?.map((t: { category_id: string }) => t.category_id) || []
      )
    } catch (error) {
      toast.error("Failed to load shoot")
      router.push("/admin/portfolio")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    setIsSaving(true)

    const form = new FormData()
    form.append("title", formData.title)
    form.append("description", formData.description)
    form.append("shoot_date", formData.shoot_date)
    form.append("location", formData.location)
    form.append("is_featured", String(formData.is_featured))
    form.append("is_published", String(formData.is_published))
    if (shoot?.cover_image_url) {
      form.append("cover_image_url", shoot.cover_image_url)
    }

    try {
      const [shootResult, tagsResult] = await Promise.all([
        updateShoot(shootId, form),
        updateShootTags(shootId, selectedTags),
      ])

      if (shootResult.error) {
        toast.error(shootResult.error)
        return
      }
      if (tagsResult.error) {
        toast.error(tagsResult.error)
        return
      }

      toast.success("Shoot updated")
      loadData()
    } catch (error) {
      toast.error("Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  function toggleTag(categoryId: string) {
    setSelectedTags((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  function getMediaCount(): number {
    if (!shoot) return 0
    return (shoot.shoot_media?.length || 0) + (shoot.shoot_gallery_links?.length || 0)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!shoot) {
    return <div>Shoot not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/portfolio">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {shoot.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit shoot details and settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shoot Details</CardTitle>
              <CardDescription>Basic information about this shoot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell the story of this shoot..."
                  rows={4}
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
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Categorize this shoot for filtering on the portfolio page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleTag(cat.id)}
                    className={`inline-flex items-center  px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedTags.includes(cat.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories found. Create categories first.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Published</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>
              <div className="pt-2 text-sm text-muted-foreground">
                <p>Slug: <code className="rounded bg-muted px-1 py-0.5">{shoot.slug}</code></p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>{getMediaCount()} images</CardDescription>
            </CardHeader>
            <CardContent>
              {shoot.cover_image_url ? (
                <img
                  src={shoot.cover_image_url}
                  alt={shoot.title}
                  className="w-full object-cover aspect-[4/3]"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Button className="mt-4 w-full" asChild>
                <Link href={`/admin/portfolio/${shootId}/media`}>
                  Manage Media
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
