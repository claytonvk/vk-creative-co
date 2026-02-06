import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getGalleryBySlug } from "@/lib/queries/galleries"
import { trackGalleryView } from "@/lib/actions/gallery-analytics"
import { GalleryView } from "@/components/gallery/gallery-view"

interface GalleryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug)

  if (!gallery) {
    return {
      title: "Gallery Not Found",
    }
  }

  return {
    title: `${gallery.name} | VK Creative`,
    description: gallery.description || `View ${gallery.client_name}'s gallery`,
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug)

  if (!gallery) {
    notFound()
  }

  // Check portal type for dashboard link
  const cookieStore = await cookies()
  const portalType = cookieStore.get("portal_type")?.value as "admin" | "client" | undefined

  // Track view
  await trackGalleryView(gallery.id)

  return <GalleryView gallery={gallery} portalType={portalType} />
}
