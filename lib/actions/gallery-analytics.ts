"use server"

import { headers } from "next/headers"
import { createClient, isAdmin } from "@/lib/supabase/server"

export async function trackGalleryView(galleryId: string) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] ||
                      headersList.get("x-real-ip") ||
                      "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Insert analytics event (ignore errors)
    await supabase.from("gallery_analytics").insert({
      gallery_id: galleryId,
      event_type: "view",
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // Increment view count
    await supabase.rpc("increment_gallery_view_count", { gallery_id: galleryId })
  } catch (error) {
    // Analytics should never break the page - fail silently
    console.error("Analytics tracking error:", error)
  }
}

export async function trackMediaDownload(galleryId: string, mediaId: string) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] ||
                      headersList.get("x-real-ip") ||
                      "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Insert analytics event
    await supabase.from("gallery_analytics").insert({
      gallery_id: galleryId,
      event_type: "download",
      media_id: mediaId,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // Increment download count
    await supabase.rpc("increment_gallery_download_count", { gallery_id: galleryId })
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

export async function trackBulkDownload(galleryId: string) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] ||
                      headersList.get("x-real-ip") ||
                      "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Insert analytics event
    await supabase.from("gallery_analytics").insert({
      gallery_id: galleryId,
      event_type: "bulk_download",
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // Increment download count
    await supabase.rpc("increment_gallery_download_count", { gallery_id: galleryId })
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

export async function getGalleryAnalytics(galleryId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized")
  }

  const supabase = await createClient()

  // Get gallery with counts
  const { data: gallery } = await supabase
    .from("client_galleries")
    .select("view_count, download_count")
    .eq("id", galleryId)
    .single()

  // Get analytics by day for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: events } = await supabase
    .from("gallery_analytics")
    .select("event_type, created_at")
    .eq("gallery_id", galleryId)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Group by day
  const dailyStats: Record<string, { views: number; downloads: number }> = {}

  events?.forEach((event) => {
    const date = new Date(event.created_at).toISOString().split("T")[0]
    if (!dailyStats[date]) {
      dailyStats[date] = { views: 0, downloads: 0 }
    }
    if (event.event_type === "view") {
      dailyStats[date].views++
    } else {
      dailyStats[date].downloads++
    }
  })

  // Convert to array
  const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    views: stats.views,
    downloads: stats.downloads,
  }))

  return {
    totalViews: gallery?.view_count || 0,
    totalDownloads: gallery?.download_count || 0,
    chartData,
  }
}
