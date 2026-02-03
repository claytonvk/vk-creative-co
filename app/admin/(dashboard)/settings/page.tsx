"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getAllSettings, updateSettings } from "@/lib/actions/settings"
import type { SiteSetting } from "@/lib/supabase/types"

type SettingsMap = Record<string, string>

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [formData, setFormData] = useState<SettingsMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await getAllSettings()
      setSettings(data)
      const map: SettingsMap = {}
      data.forEach((s) => {
        map[s.key] = s.value || ""
      })
      setFormData(map)
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value: value || null,
      }))
      const result = await updateSettings(updates)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Settings saved")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const heroSettings = [
    { key: "hero_title", label: "Title", type: "text" },
    { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
    { key: "hero_cta_text", label: "Primary CTA Text", type: "text" },
    { key: "hero_cta_link", label: "Primary CTA Link", type: "text" },
    { key: "hero_secondary_cta_text", label: "Secondary CTA Text", type: "text" },
    { key: "hero_secondary_cta_link", label: "Secondary CTA Link", type: "text" },
  ]

  const contactSettings = [
    { key: "contact_email", label: "Email", type: "text" },
    { key: "contact_phone", label: "Phone", type: "text" },
    { key: "contact_address", label: "Address", type: "text" },
    { key: "contact_hours", label: "Business Hours", type: "text" },
  ]

  const socialSettings = [
    { key: "social_instagram", label: "Instagram URL", type: "text" },
    { key: "social_facebook", label: "Facebook URL", type: "text" },
    { key: "social_pinterest", label: "Pinterest URL", type: "text" },
    { key: "social_tiktok", label: "TikTok URL", type: "text" },
  ]

  const aboutSettings = [
    { key: "about_headline", label: "Headline", type: "text" },
    { key: "about_intro", label: "Intro Text", type: "textarea" },
    { key: "about_content", label: "Main Content", type: "textarea" },
    { key: "about_image", label: "Image URL", type: "text" },
  ]

  const footerSettings = [
    { key: "footer_tagline", label: "Tagline", type: "text" },
    { key: "footer_copyright", label: "Copyright Text", type: "text" },
  ]

  function renderField(setting: { key: string; label: string; type: string }) {
    return (
      <div key={setting.key} className="space-y-2">
        <Label htmlFor={setting.key}>{setting.label}</Label>
        {setting.type === "textarea" ? (
          <Textarea
            id={setting.key}
            value={formData[setting.key] || ""}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            id={setting.key}
            value={formData[setting.key] || ""}
            onChange={(e) => handleChange(setting.key, e.target.value)}
          />
        )}
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings"
        description="Manage global site content and configuration"
      />

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the homepage hero section content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroSettings.map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Page</CardTitle>
              <CardDescription>
                Configure the about page content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutSettings.map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Your business contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactSettings.map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Links to your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialSettings.map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>
                Footer content and copyright information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerSettings.map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  )
}
