import { notFound } from "next/navigation"
import { getGalleryByToken } from "@/lib/queries/galleries"
import { trackGalleryView } from "@/lib/actions/gallery-analytics"
import { GalleryView } from "@/components/gallery/gallery-view"

interface GalleryPageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { token } = await params
  const gallery = await getGalleryByToken(token)

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
  const { token } = await params
  const gallery = await getGalleryByToken(token)

  if (!gallery) {
    notFound()
  }

  // Track view
  await trackGalleryView(gallery.id)

  return <GalleryView gallery={gallery} />
}
