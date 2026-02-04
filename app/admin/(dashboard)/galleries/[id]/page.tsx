"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { GalleryThemePicker } from "@/components/admin/gallery-theme-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Mail,
  RefreshCw,
  Images,
  BarChart3,
} from "lucide-react"
import type { ClientGallery, GalleryMedia, GalleryTheme } from "@/lib/supabase/types"
import {
  getGallery,
  updateGallery,
  publishGallery,
  unpublishGallery,
  regenerateAccessToken,
} from "@/lib/actions/galleries"
import { sendGalleryReadyEmail } from "@/lib/actions/gallery-email"

type GalleryWithMedia = ClientGallery & {
  gallery_media: GalleryMedia[]
}

export default function GalleryEditPage() {
  const params = useParams()
  const router = useRouter()
  const galleryId = params.id as string

  const [gallery, setGallery] = useState<GalleryWithMedia | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    client_name: "",
    client_email: "",
    event_date: "",
    description: "",
    theme: "minimal" as GalleryTheme,
    theme_color: "#1a1a1a",
    access_mode: "guest_link" as "guest_link" | "client_account",
    expires_at: "",
    allow_downloads: true,
    allow_bulk_download: true,
    cover_image_url: "",
  })

  useEffect(() => {
    loadGallery()
  }, [galleryId])

  async function loadGallery() {
    try {
      const data = await getGallery(galleryId)
      setGallery(data as GalleryWithMedia)
      setFormData({
        name: data.name,
        client_name: data.client_name,
        client_email: data.client_email,
        event_date: data.event_date || "",
        description: data.description || "",
        theme: data.theme,
        theme_color: data.theme_color || "#1a1a1a",
        access_mode: data.access_mode,
        expires_at: data.expires_at ? data.expires_at.split("T")[0] : "",
        allow_downloads: data.allow_downloads,
        allow_bulk_download: data.allow_bulk_download,
        cover_image_url: data.cover_image_url || "",
      })
    } catch (error) {
      toast.error("Failed to load gallery")
      router.push("/admin/galleries")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const form = new FormData()
    form.append("name", formData.name)
    form.append("client_name", formData.client_name)
    form.append("client_email", formData.client_email)
    form.append("event_date", formData.event_date)
    form.append("description", formData.description)
    form.append("theme", formData.theme)
    form.append("theme_color", formData.theme_color)
    form.append("access_mode", formData.access_mode)
    form.append("expires_at", formData.expires_at)
    form.append("allow_downloads", String(formData.allow_downloads))
    form.append("allow_bulk_download", String(formData.allow_bulk_download))
    form.append("cover_image_url", formData.cover_image_url)

    try {
      const result = await updateGallery(galleryId, form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Gallery updated")
      loadGallery()
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePublish() {
    try {
      const result = gallery?.is_published
        ? await unpublishGallery(galleryId)
        : await publishGallery(galleryId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(gallery?.is_published ? "Gallery unpublished" : "Gallery published")
      loadGallery()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleRegenerateToken() {
    if (!confirm("This will invalidate the current gallery link. Continue?")) return

    try {
      const result = await regenerateAccessToken(galleryId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("New access token generated")
      loadGallery()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  async function handleSendEmail() {
    try {
      const result = await sendGalleryReadyEmail(galleryId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Email sent to client")
    } catch (error) {
      toast.error("Failed to send email")
    }
  }

  function copyGalleryLink() {
    if (!gallery) return
    const url = `${window.location.origin}/gallery/${gallery.slug}`
    navigator.clipboard.writeText(url)
    toast.success("Gallery link copied to clipboard")
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
          <Link href="/admin/galleries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{gallery.name}</h1>
          <p className="text-sm text-muted-foreground">
            {gallery.client_name} • {gallery.gallery_media?.length || 0} files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={gallery.is_published ? "default" : "outline"}>
            {gallery.is_published ? "Published" : "Draft"}
          </Badge>
          <Button variant="outline" onClick={handlePublish}>
            {gallery.is_published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Images className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Gallery</CardTitle>
              <CardDescription>
                Share this link with your client to give them access to their gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/gallery/${gallery.slug}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={copyGalleryLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                {gallery.is_published && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`/gallery/${gallery.slug}`, "_blank")
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRegenerateToken}
                  className="text-muted-foreground"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Link
                </Button>
                {gallery.is_published && (
                  <Button onClick={handleSendEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send to Client
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Gallery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Gallery Name</Label>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Choose how your gallery will look to clients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <GalleryThemePicker
                  value={formData.theme}
                  onChange={(theme) => setFormData({ ...formData, theme })}
                />

                <div className="space-y-3">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm cursor-pointer overflow-hidden"
                      style={{ backgroundColor: formData.theme_color }}
                    >
                      <input
                        type="color"
                        value={formData.theme_color}
                        onChange={(e) =>
                          setFormData({ ...formData, theme_color: e.target.value })
                        }
                        className="h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                    <Input
                      value={formData.theme_color}
                      onChange={(e) =>
                        setFormData({ ...formData, theme_color: e.target.value })
                      }
                      placeholder="#1a1a1a"
                      className="w-28 font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      {["#1a1a1a", "#78350f", "#0f766e", "#6d28d9", "#be123c"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, theme_color: color })}
                          className={`h-8 w-8 rounded-full border-2 transition-all ${
                            formData.theme_color === color
                              ? "border-foreground scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This color will be used for accents, buttons, and highlights in your gallery.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Access & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
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

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiration Date</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) =>
                        setFormData({ ...formData, expires_at: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_downloads">Allow Downloads</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow clients to download individual files
                      </p>
                    </div>
                    <Switch
                      id="allow_downloads"
                      checked={formData.allow_downloads}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allow_downloads: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_bulk_download">Allow Bulk Download</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow clients to download all files as a ZIP
                      </p>
                    </div>
                    <Switch
                      id="allow_bulk_download"
                      checked={formData.allow_bulk_download}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allow_bulk_download: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Media</CardTitle>
              <CardDescription>
                Manage the photos and videos in this gallery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/galleries/${galleryId}/media`}>
                <Button>
                  <Images className="mr-2 h-4 w-4" />
                  Manage Media
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Analytics</CardTitle>
              <CardDescription>
                View engagement statistics for this gallery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/galleries/${galleryId}/analytics`}>
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
