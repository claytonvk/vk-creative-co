"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { ImageSettingUpload } from "@/components/admin/image-setting-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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

  function renderTextField(key: string, label: string, placeholder?: string) {
    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    )
  }

  function renderTextArea(key: string, label: string, rows = 3, placeholder?: string) {
    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <Textarea
          id={key}
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
      </div>
    )
  }

  function renderImageField(key: string, label: string, description?: string, aspectRatio?: string) {
    return (
      <ImageSettingUpload
        settingKey={key}
        label={label}
        currentUrl={formData[key] || null}
        onUpload={(url) => handleChange(key, url)}
        description={description}
        aspectRatio={aspectRatio}
      />
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings"
        description="Manage all page content, images, and configuration"
      />

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* HOME PAGE */}
        <TabsContent value="home" className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                The main banner that visitors see first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {renderTextField("hero_tagline", "Tagline", "family + lifestyle photographer")}
                  {renderTextField("hero_title", "Title", "Stories Worth Telling")}
                  {renderTextArea("hero_subtitle", "Subtitle", 2, "Cinematic visuals for weddings...")}
                </div>
                <div className="space-y-4">
                  {renderTextField("hero_cta_text", "Primary Button Text", "View Our Work")}
                  {renderTextField("hero_cta_link", "Primary Button Link", "/portfolio")}
                  {renderTextField("hero_secondary_cta_text", "Secondary Button Text", "Watch Showreel")}
                </div>
              </div>
              <Separator />
              {renderImageField(
                "hero_background_image",
                "Background Image",
                "Recommended: 1920x1080px or larger, will be darkened with overlay",
                "16/9"
              )}
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>
                The bottom section encouraging visitors to contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("cta_tagline", "Tagline", "Ready to Begin?")}
              {renderTextField("cta_title", "Title", "Let's Create Something Beautiful")}
              {renderTextArea("cta_description", "Description", 2)}
              <div className="grid gap-4 md:grid-cols-2">
                {renderTextField("cta_primary_text", "Primary Button Text", "Get in Touch")}
                {renderTextField("cta_primary_link", "Primary Button Link", "/contact")}
                {renderTextField("cta_secondary_text", "Secondary Button Text", "View Packages")}
                {renderTextField("cta_secondary_link", "Secondary Button Link", "/investment")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PAGE */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Hero</CardTitle>
              <CardDescription>
                The introduction section of the about page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {renderTextField("about_tagline", "Tagline", "About")}
                  {renderTextField("about_title", "Title", "The Story Behind the Lens")}
                  {renderTextArea("about_intro", "Introduction Paragraph", 4)}
                  {renderTextArea("about_content", "Second Paragraph", 4)}
                </div>
                <div>
                  {renderImageField(
                    "about_portrait_image",
                    "Portrait Image",
                    "Recommended: 800x1000px, portrait orientation",
                    "4/5"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Section</CardTitle>
              <CardDescription>
                The "How We Work" process steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("about_process_tagline", "Tagline", "How We Work")}
              {renderTextField("about_process_title", "Title", "Our Process")}
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {renderTextField("about_step1_title", "Step 1 Title", "Discovery")}
                  {renderTextArea("about_step1_desc", "Step 1 Description", 2)}
                </div>
                <div className="space-y-4">
                  {renderTextField("about_step2_title", "Step 2 Title", "Planning")}
                  {renderTextArea("about_step2_desc", "Step 2 Description", 2)}
                </div>
                <div className="space-y-4">
                  {renderTextField("about_step3_title", "Step 3 Title", "Capture")}
                  {renderTextArea("about_step3_desc", "Step 3 Description", 2)}
                </div>
                <div className="space-y-4">
                  {renderTextField("about_step4_title", "Step 4 Title", "Delivery")}
                  {renderTextArea("about_step4_desc", "Step 4 Description", 2)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gear & Credentials</CardTitle>
              <CardDescription>
                Equipment list and credentials (comma-separated)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextArea("about_gear_list", "Equipment List", 3, "Sony Alpha Series, Zeiss Lenses, ...")}
              {renderTextArea("about_credentials_list", "Credentials List", 3, "10+ Years Experience, 500+ Events, ...")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About CTA</CardTitle>
              <CardDescription>
                Call to action at the bottom of the about page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("about_cta_title", "Title", "Let's work together")}
              {renderTextArea("about_cta_description", "Description", 2)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVESTMENT PAGE */}
        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Page Hero</CardTitle>
              <CardDescription>
                The header section of the pricing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("investment_tagline", "Tagline", "Pricing")}
              {renderTextField("investment_title", "Title", "Investment")}
              {renderTextArea("investment_description", "Description", 2)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment CTA</CardTitle>
              <CardDescription>
                Bottom section encouraging custom inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("investment_cta_title", "Title", "Ready to book your session?")}
              {renderTextArea("investment_cta_description", "Description", 2)}
              {renderTextField("investment_custom_text", "Custom Package Text", "Looking for something different?")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PORTFOLIO PAGE */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Page Hero</CardTitle>
              <CardDescription>
                The header section of the portfolio page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("portfolio_tagline", "Tagline", "Our Work")}
              {renderTextField("portfolio_title", "Title", "Portfolio")}
              {renderTextArea("portfolio_description", "Description", 2)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT PAGE */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Page Hero</CardTitle>
              <CardDescription>
                The header section of the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("contact_tagline", "Tagline", "Contact")}
              {renderTextField("contact_title", "Title", "Get in Touch")}
              {renderTextArea("contact_description", "Description", 2)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Your business contact details shown on the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("contact_email", "Email", "hello@vkcreative.com")}
              {renderTextField("contact_phone", "Phone", "(555) 123-4567")}
              {renderTextField("contact_address", "Location", "Los Angeles, California")}
              {renderTextField("contact_instagram", "Instagram Handle", "@vkcreative")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability Section</CardTitle>
              <CardDescription>
                Show your booking availability status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextArea("contact_availability_text", "Availability Description", 2)}
              {renderTextField("contact_current_year", "Current Year Label", "2025 Season")}
              {renderTextField("contact_current_year_status", "Current Year Status", "Limited")}
              {renderTextField("contact_current_year_percent", "Current Year Booked %", "85")}
              {renderTextField("contact_next_year", "Next Year Label", "2026 Season")}
              {renderTextField("contact_next_year_status", "Next Year Status", "Available")}
              {renderTextField("contact_next_year_percent", "Next Year Booked %", "35")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTextArea("contact_response_text", "Response Time Note", 2)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Links to your social media profiles (shown in footer)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("social_instagram", "Instagram URL", "https://instagram.com/...")}
              {renderTextField("social_facebook", "Facebook URL", "https://facebook.com/...")}
              {renderTextField("social_pinterest", "Pinterest URL", "https://pinterest.com/...")}
              {renderTextField("social_tiktok", "TikTok URL", "https://tiktok.com/...")}
              {renderTextField("social_youtube", "YouTube URL", "https://youtube.com/...")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>
                Content displayed in the site footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextField("footer_tagline", "Tagline", "Capturing moments that matter")}
              {renderTextField("footer_copyright", "Copyright Text", "VK Creative. All rights reserved.")}
              {renderTextArea("footer_description", "Description", 2)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer Logo</CardTitle>
            </CardHeader>
            <CardContent>
              {renderImageField(
                "footer_logo",
                "Footer Logo",
                "Optional alternate logo for the footer. Leave empty to use main logo.",
                "3/1"
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end sticky bottom-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="shadow-lg"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  )
}
