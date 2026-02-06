interface MinimalThemeProps {
  children: React.ReactNode
  themeColor?: string
}

export function MinimalTheme({ children, themeColor = "#1a1a1a" }: MinimalThemeProps) {
  return (
    <div className="minimal-theme min-h-screen bg-white text-gray-900">
      <style jsx global>{`
        .minimal-theme {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          --theme-color: ${themeColor};
        }
        .minimal-theme .gallery-title {
          font-weight: 300;
          letter-spacing: 0.1em;
          color: ${themeColor};
        }
        .minimal-theme .gallery-date {
          color: #666;
        }
        .minimal-theme .gallery-description {
          color: #444;
          font-weight: 300;
        }
        .minimal-theme .gallery-button {
          border-color: #e0e0e0;
          color: #333;
          background: transparent;
        }
        .minimal-theme .gallery-button:hover {
          background: #f5f5f5;
          border-color: ${themeColor};
          color: ${themeColor};
        }
        .minimal-theme .gallery-grid img,
        .minimal-theme .gallery-grid video {
          border-radius: 2px;
        }
      `}</style>
      {children}
    </div>
  )
}
