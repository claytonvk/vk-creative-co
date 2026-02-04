/**
 * Client-side image compression and WebP conversion utility
 * Uses Canvas API for browser-based image processing
 */

export interface CompressionOptions {
  /** Quality from 0 to 1 (0.85 = 85% quality, good balance) */
  quality?: number
  /** Maximum width in pixels (maintains aspect ratio) */
  maxWidth?: number
  /** Maximum height in pixels (maintains aspect ratio) */
  maxHeight?: number
  /** Output format */
  format?: "webp" | "jpeg" | "png"
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  width: number
  height: number
}

const DEFAULT_OPTIONS: CompressionOptions = {
  quality: 0.85,
  maxWidth: 2400,
  maxHeight: 2400,
  format: "webp",
}

/**
 * Compresses and converts an image file to WebP format
 * Optimized for web while retaining high visual quality
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    // Validate input
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"))
      return
    }

    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      const maxWidth = opts.maxWidth!
      const maxHeight = opts.maxHeight!

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw image with high quality settings
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      const mimeType = `image/${opts.format}`
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"))
            return
          }

          // Create new file with WebP extension
          const originalName = file.name.replace(/\.[^/.]+$/, "")
          const newFileName = `${originalName}.${opts.format}`
          const compressedFile = new File([blob], newFileName, {
            type: mimeType,
            lastModified: Date.now(),
          })

          resolve({
            file: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            compressionRatio: Math.round((1 - compressedFile.size / file.size) * 100),
            width,
            height,
          })
        },
        mimeType,
        opts.quality
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    // Load image from file
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Checks if the browser supports WebP encoding
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL("image/webp").startsWith("data:image/webp")
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
