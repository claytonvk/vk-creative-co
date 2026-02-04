import { notFound } from "next/navigation"
import { getShootBySlug } from "@/lib/queries/shoots"
import { ShootDetail } from "./shoot-detail"

interface ShootPageProps {
  params: Promise<{ slug: string }>
}

export default async function ShootPage({ params }: ShootPageProps) {
  const { slug } = await params

  let shoot
  try {
    shoot = await getShootBySlug(slug)
  } catch {
    notFound()
  }

  if (!shoot) {
    notFound()
  }

  // Build unified media list
  type MediaImage = { url: string; alt: string }
  const images: MediaImage[] = []

  // Uploaded media
  for (const m of shoot.shoot_media || []) {
    images.push({
      url: m.file_url,
      alt: m.alt_text || shoot.title,
    })
  }

  // Linked gallery media
  for (const link of shoot.shoot_gallery_links || []) {
    if (link.gallery_media) {
      images.push({
        url: link.gallery_media.file_url,
        alt: shoot.title,
      })
    }
  }

  // Sort by display_order (already sorted from query, but merge both lists)
  // Build a combined order map
  type OrderedItem = { url: string; alt: string; order: number }
  const ordered: OrderedItem[] = []

  for (const m of shoot.shoot_media || []) {
    ordered.push({
      url: m.file_url,
      alt: m.alt_text || shoot.title,
      order: m.display_order,
    })
  }

  for (const link of shoot.shoot_gallery_links || []) {
    if (link.gallery_media) {
      ordered.push({
        url: link.gallery_media.file_url,
        alt: shoot.title,
        order: link.display_order,
      })
    }
  }

  ordered.sort((a, b) => a.order - b.order)

  const sortedImages = ordered.map(({ url, alt }) => ({ url, alt }))

  const tags = (shoot.shoot_tags || [])
    .map((t: { categories: { name: string; slug: string } | null }) => t.categories?.name)
    .filter(Boolean) as string[]

  return (
    <ShootDetail
      title={shoot.title}
      description={shoot.description}
      location={shoot.location}
      shootDate={shoot.shoot_date}
      tags={tags}
      images={sortedImages}
    />
  )
}
