// Database types for Supabase
// Run `npx supabase gen types typescript` to generate full types after migrations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          category_id: string | null
          display_order: number
          is_featured: boolean
          is_published: boolean
          alt_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          category_id?: string | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          category_id?: string | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      investment_packages: {
        Row: {
          id: string
          name: string
          price: number
          price_display: string | null
          description: string | null
          features: Json
          display_order: number
          is_featured: boolean
          is_published: boolean
          badge_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          price_display?: string | null
          description?: string | null
          features?: Json
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          badge_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          price_display?: string | null
          description?: string | null
          features?: Json
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          badge_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          quote: string
          author_name: string
          author_role: string | null
          author_image_url: string | null
          rating: number | null
          display_order: number
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote: string
          author_name: string
          author_role?: string | null
          author_image_url?: string | null
          rating?: number | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote?: string
          author_name?: string
          author_role?: string | null
          author_image_url?: string | null
          rating?: number | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      value_props: {
        Row: {
          id: string
          title: string
          description: string
          icon: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string | null
          value_json: Json | null
          category: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          value_json?: Json | null
          category?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          value_json?: Json | null
          category?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      client_galleries: {
        Row: {
          id: string
          name: string
          client_name: string
          client_email: string
          event_date: string | null
          description: string | null
          theme: 'minimal' | 'romantic' | 'editorial'
          access_mode: 'guest_link' | 'client_account'
          access_token: string
          expires_at: string | null
          allow_downloads: boolean
          allow_bulk_download: boolean
          cover_image_url: string | null
          is_published: boolean
          view_count: number
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_name: string
          client_email: string
          event_date?: string | null
          description?: string | null
          theme?: 'minimal' | 'romantic' | 'editorial'
          access_mode?: 'guest_link' | 'client_account'
          access_token: string
          expires_at?: string | null
          allow_downloads?: boolean
          allow_bulk_download?: boolean
          cover_image_url?: string | null
          is_published?: boolean
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_name?: string
          client_email?: string
          event_date?: string | null
          description?: string | null
          theme?: 'minimal' | 'romantic' | 'editorial'
          access_mode?: 'guest_link' | 'client_account'
          access_token?: string
          expires_at?: string | null
          allow_downloads?: boolean
          allow_bulk_download?: boolean
          cover_image_url?: string | null
          is_published?: boolean
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      gallery_media: {
        Row: {
          id: string
          gallery_id: string
          file_url: string
          file_type: 'image' | 'video'
          filename: string
          file_size: number | null
          width: number | null
          height: number | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          file_url: string
          file_type?: 'image' | 'video'
          filename: string
          file_size?: number | null
          width?: number | null
          height?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          file_url?: string
          file_type?: 'image' | 'video'
          filename?: string
          file_size?: number | null
          width?: number | null
          height?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_clients: {
        Row: {
          id: string
          gallery_id: string
          client_id: string
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          client_id: string
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          client_id?: string
          created_at?: string
        }
      }
      gallery_analytics: {
        Row: {
          id: string
          gallery_id: string
          event_type: 'view' | 'download' | 'bulk_download'
          media_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          event_type: 'view' | 'download' | 'bulk_download'
          media_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          event_type?: 'view' | 'download' | 'bulk_download'
          media_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}

// Helper types
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type PortfolioImage = Database["public"]["Tables"]["portfolio_images"]["Row"]
export type InvestmentPackage = Database["public"]["Tables"]["investment_packages"]["Row"]
export type FAQ = Database["public"]["Tables"]["faqs"]["Row"]
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]
export type ValueProp = Database["public"]["Tables"]["value_props"]["Row"]
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"]
export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"]

// Gallery types
export type ClientGallery = Database["public"]["Tables"]["client_galleries"]["Row"]
export type GalleryMedia = Database["public"]["Tables"]["gallery_media"]["Row"]
export type Client = Database["public"]["Tables"]["clients"]["Row"]
export type GalleryClient = Database["public"]["Tables"]["gallery_clients"]["Row"]
export type GalleryAnalytics = Database["public"]["Tables"]["gallery_analytics"]["Row"]

// Gallery theme type
export type GalleryTheme = 'minimal' | 'romantic' | 'editorial'

// Gallery with media (joined type)
export type ClientGalleryWithMedia = ClientGallery & {
  gallery_media: GalleryMedia[]
}
