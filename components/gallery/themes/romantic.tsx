interface RomanticThemeProps {
  children: React.ReactNode
  themeColor?: string
}

export function RomanticTheme({ children, themeColor = "#78350f" }: RomanticThemeProps) {
  return (
    <div className="romantic-theme min-h-screen bg-amber-50 text-amber-950">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');

        .romantic-theme {
          font-family: "Cormorant Garamond", Georgia, serif;
          --theme-color: ${themeColor};
        }
        .romantic-theme .gallery-header {
          background: linear-gradient(
            to bottom,
            rgba(255, 251, 235, 1) 0%,
            rgba(255, 251, 235, 0) 100%
          );
        }
        .romantic-theme .gallery-title {
          font-weight: 300;
          letter-spacing: 0.15em;
          color: ${themeColor};
          font-style: italic;
        }
        .romantic-theme .gallery-date {
          color: ${themeColor};
          opacity: 0.8;
          font-style: italic;
        }
        .romantic-theme .gallery-description {
          color: ${themeColor};
          opacity: 0.9;
          font-style: italic;
        }
        .romantic-theme .gallery-button {
          border-color: ${themeColor}60;
          color: ${themeColor};
          background: rgba(255, 255, 255, 0.5);
          font-family: "Cormorant Garamond", Georgia, serif;
        }
        .romantic-theme .gallery-button:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: ${themeColor};
        }
        .romantic-theme .gallery-grid img,
        .romantic-theme .gallery-grid video {
          border-radius: 4px;
          box-shadow: 0 4px 20px ${themeColor}15;
        }
        .romantic-theme .gallery-grid .group:hover img {
          box-shadow: 0 8px 30px ${themeColor}20;
        }
      `}</style>
      {children}
    </div>
  )
}
