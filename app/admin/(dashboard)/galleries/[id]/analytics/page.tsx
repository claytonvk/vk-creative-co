"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Eye, Download, TrendingUp } from "lucide-react"
import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { getGallery } from "@/lib/actions/galleries"
import { getGalleryAnalytics } from "@/lib/actions/gallery-analytics"
import type { ClientGallery } from "@/lib/supabase/types"

type AnalyticsData = {
  totalViews: number
  totalDownloads: number
  chartData: { date: string; views: number; downloads: number }[]
}

export default function GalleryAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const galleryId = params.id as string

  const [gallery, setGallery] = useState<ClientGallery | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [galleryId])

  async function loadData() {
    try {
      const [galleryData, analyticsData] = await Promise.all([
        getGallery(galleryId),
        getGalleryAnalytics(galleryId),
      ])
      setGallery(galleryData as ClientGallery)
      setAnalytics(analyticsData)
    } catch (error) {
      toast.error("Failed to load analytics")
      router.push(`/admin/galleries/${galleryId}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!gallery || !analytics) {
    return <div>Gallery not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/galleries/${galleryId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {gallery.name} - Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            View engagement statistics
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDownloads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalViews > 0
                ? Math.round((analytics.totalDownloads / analytics.totalViews) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Downloads per view</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
          <CardDescription>Views and downloads in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.chartData.length > 0 ? (
            <AnalyticsChart data={analytics.chartData} />
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No activity data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
