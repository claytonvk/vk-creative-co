import Image from "next/image"

interface SlimImageSectionProps {
  src: string
  alt?: string
}

export function SingleImageSection({
  src,
  alt = "Decorative divider",
}: SlimImageSectionProps) {
  return (
    <section className="pt-12">
      <div className="container mx-auto px-6 flex items-center justify-center">
        <div className="relative w-[600px] h-[100px]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
