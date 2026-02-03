import { cn } from "@/lib/utils"

interface RomanticThemeProps {
  children: React.ReactNode
}

export function RomanticTheme({ children }: RomanticThemeProps) {
  return (
    <div className="romantic-theme min-h-screen bg-amber-50 text-amber-950">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');

        .romantic-theme {
          font-family: "Cormorant Garamond", Georgia, serif;
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
          color: #78350f;
          font-style: italic;
        }
        .romantic-theme .gallery-date {
          color: #92400e;
          font-style: italic;
        }
        .romantic-theme .gallery-description {
          color: #78350f;
          font-style: italic;
        }
        .romantic-theme .gallery-button {
          border-color: #d4a574;
          color: #78350f;
          background: rgba(255, 255, 255, 0.5);
          font-family: "Cormorant Garamond", Georgia, serif;
        }
        .romantic-theme .gallery-button:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: #b8860b;
        }
        .romantic-theme .gallery-grid img,
        .romantic-theme .gallery-grid video {
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(120, 53, 15, 0.1);
        }
        .romantic-theme .gallery-grid .group:hover img {
          box-shadow: 0 8px 30px rgba(120, 53, 15, 0.15);
        }
      `}</style>
      {children}
    </div>
  )
}
