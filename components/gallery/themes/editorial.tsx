interface EditorialThemeProps {
  children: React.ReactNode
  themeColor?: string
}

export function EditorialTheme({ children, themeColor = "#ffffff" }: EditorialThemeProps) {
  return (
    <div className="editorial-theme min-h-screen bg-gray-950 text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400&display=swap');

        .editorial-theme {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          --theme-color: ${themeColor};
        }
        .editorial-theme .gallery-title {
          font-family: "Bebas Neue", sans-serif;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #fff;
          text-transform: uppercase;
          font-size: 3rem;
        }
        @media (min-width: 768px) {
          .editorial-theme .gallery-title {
            font-size: 4rem;
          }
        }
        .editorial-theme .gallery-date {
          color: ${themeColor};
          opacity: 0.7;
          font-weight: 300;
        }
        .editorial-theme .gallery-description {
          color: #aaa;
          font-weight: 300;
        }
        .editorial-theme .gallery-button {
          border-color: ${themeColor}50;
          color: #fff;
          background: transparent;
        }
        .editorial-theme .gallery-button:hover {
          background: ${themeColor}20;
          border-color: ${themeColor};
        }
        .editorial-theme .gallery-grid img,
        .editorial-theme .gallery-grid video {
          border-radius: 0;
        }
        .editorial-theme .gallery-grid {
          gap: 2px;
        }
        .editorial-theme .gallery-grid > div > div {
          gap: 2px;
        }
        .editorial-theme .gallery-grid .group {
          margin-bottom: 2px;
        }
      `}</style>
      {children}
    </div>
  )
}
