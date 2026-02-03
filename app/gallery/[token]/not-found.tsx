import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GalleryNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-4xl font-light tracking-wide">Gallery Not Found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        This gallery may have expired, been removed, or the link may be incorrect.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
