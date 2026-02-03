import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Images, Calendar, ExternalLink } from "lucide-react"
import { getClientProfile } from "@/lib/actions/client-auth"
import { getClientGalleries } from "@/lib/queries/galleries"
import type { ClientGallery } from "@/lib/supabase/types"

type GalleryWithCount = ClientGallery & {
  gallery_media: { count: number }[]
}

export default async function ClientDashboardPage() {
  const client = await getClientProfile()

  if (!client) {
    return null
  }

  const galleries = (await getClientGalleries(client.id)) as GalleryWithCount[]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {client.name}</h1>
        <p className="text-muted-foreground">
          View and download your galleries
        </p>
      </div>

      {galleries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Images className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No galleries yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You'll see your galleries here once they're ready.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/gallery/${gallery.access_token}`}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-muted">
                  {gallery.cover_image_url ? (
                    <img
                      src={gallery.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Images className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium group-hover:text-primary">
                        {gallery.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        {gallery.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(gallery.event_date).toLocaleDateString()}
                          </span>
                        )}
                        <span>{gallery.gallery_media?.[0]?.count || 0} photos</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
