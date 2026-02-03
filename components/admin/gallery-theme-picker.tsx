"use client"

import { cn } from "@/lib/utils"
import type { GalleryTheme } from "@/lib/supabase/types"

interface GalleryThemePickerProps {
  value: GalleryTheme
  onChange: (theme: GalleryTheme) => void
}

const themes: {
  id: GalleryTheme
  name: string
  description: string
  preview: {
    bg: string
    text: string
    accent: string
  }
}[] = [
  {
    id: "minimal",
    name: "Clean & Minimal",
    description: "White background, thin fonts, lots of whitespace",
    preview: {
      bg: "bg-white",
      text: "text-gray-900",
      accent: "border-gray-200",
    },
  },
  {
    id: "romantic",
    name: "Soft & Romantic",
    description: "Cream tones, soft shadows, elegant typography",
    preview: {
      bg: "bg-amber-50",
      text: "text-amber-900",
      accent: "border-amber-200",
    },
  },
  {
    id: "editorial",
    name: "Bold & Editorial",
    description: "Dark background, bold typography, high contrast",
    preview: {
      bg: "bg-gray-950",
      text: "text-white",
      accent: "border-gray-800",
    },
  },
]

export function GalleryThemePicker({ value, onChange }: GalleryThemePickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={cn(
            "flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all",
            value === theme.id
              ? "border-primary ring-2 ring-primary ring-offset-2"
              : "border-muted hover:border-muted-foreground/50"
          )}
          onClick={() => onChange(theme.id)}
        >
          {/* Preview area */}
          <div
            className={cn(
              "flex h-24 items-center justify-center border-b p-4",
              theme.preview.bg,
              theme.preview.accent
            )}
          >
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-12 w-10 rounded border",
                    theme.preview.accent,
                    theme.preview.bg === "bg-gray-950" ? "bg-gray-800" : "bg-white"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Info area */}
          <div className="p-3">
            <h3 className="font-medium">{theme.name}</h3>
            <p className="text-xs text-muted-foreground">{theme.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
