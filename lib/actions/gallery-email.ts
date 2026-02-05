"use server"

import { Resend } from "resend"
import { createClient, isAdmin } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`

const logoHtml = `
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${siteUrl}/images/logo.png" alt="VK Creative" style="width: 150px; height: auto;" />
  </div>
`

export async function sendGalleryReadyEmail(galleryId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data: gallery, error } = await supabase
    .from("client_galleries")
    .select("*")
    .eq("id", galleryId)
    .single()

  if (error || !gallery) {
    return { error: "Gallery not found" }
  }

  if (!gallery.is_published) {
    return { error: "Gallery must be published before sending notification" }
  }

  const galleryUrl = `${siteUrl}/gallery/${gallery.slug}`

  if (gallery.access_mode === "client_account") {
    return await sendClientAccountEmail(gallery)
  }

  return await sendGuestLinkEmail(gallery, galleryUrl)
}

async function sendGuestLinkEmail(gallery: any, galleryUrl: string) {
  try {
    await resend.emails.send({
      from: "VK Creative <gallery@vkfilmandphoto.com>",
      to: gallery.client_email,
      subject: `Your ${gallery.name} Gallery is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${logoHtml}

          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin-bottom: 10px;">Your Gallery is Ready</h1>
          </div>

          <p>Hi ${gallery.client_name},</p>

          <p>Great news! Your <strong>${gallery.name}</strong> gallery is now ready for viewing.</p>

          ${gallery.description ? `<p style="color: #666; font-style: italic;">${gallery.description}</p>` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${galleryUrl}"
               style="background-color: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              View Your Gallery
            </a>
          </div>

          ${gallery.expires_at ? `
            <p style="color: #666; font-size: 14px; text-align: center;">
              This gallery link expires on ${new Date(gallery.expires_at).toLocaleDateString()}.
            </p>
          ` : ''}

          ${gallery.allow_downloads ? `
            <p style="color: #666; font-size: 14px;">
              You can download individual photos${gallery.allow_bulk_download ? ' or all photos at once' : ''} from your gallery.
            </p>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by VK Creative. If you have any questions, please reply to this email.
          </p>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send gallery email:", err)
    return { error: "Failed to send email" }
  }
}

async function sendClientAccountEmail(gallery: any) {
  const supabase = await createClient()

  // Auto-create client record if one doesn't exist
  let { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", gallery.client_email)
    .single()

  if (!client) {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        email: gallery.client_email,
        name: gallery.client_name,
      })
      .select()
      .single()

    if (clientError) {
      console.error("Failed to create client record:", clientError)
      return { error: "Failed to create client record" }
    }

    client = newClient
  }

  if (!client) {
    return { error: "Failed to create client record" }
  }

  // Auto-create gallery_clients link if it doesn't exist
  const { data: existingLink } = await supabase
    .from("gallery_clients")
    .select("id")
    .eq("gallery_id", gallery.id)
    .eq("client_id", client.id)
    .single()

  if (!existingLink) {
    const { error: linkError } = await supabase
      .from("gallery_clients")
      .insert({
        gallery_id: gallery.id,
        client_id: client.id,
      })

    if (linkError) {
      console.error("Failed to link gallery to client:", linkError)
      return { error: "Failed to link gallery to client" }
    }
  }

  const loginUrl = `${siteUrl}/client/login?email=${encodeURIComponent(gallery.client_email)}&gallery=${encodeURIComponent(gallery.slug)}`

  try {
    await resend.emails.send({
      from: "VK Creative <gallery@vkfilmandphoto.com>",
      to: gallery.client_email,
      subject: `Your ${gallery.name} Gallery is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${logoHtml}

          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin-bottom: 10px;">Your Gallery is Ready</h1>
          </div>

          <p>Hi ${gallery.client_name},</p>

          <p>Great news! Your <strong>${gallery.name}</strong> gallery is now ready for viewing.</p>

          ${gallery.description ? `<p style="color: #666; font-style: italic;">${gallery.description}</p>` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}"
               style="background-color: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              View Your Gallery
            </a>
          </div>

          ${gallery.expires_at ? `
            <p style="color: #666; font-size: 14px; text-align: center;">
              This gallery link expires on ${new Date(gallery.expires_at).toLocaleDateString()}.
            </p>
          ` : ''}

          ${gallery.allow_downloads ? `
            <p style="color: #666; font-size: 14px;">
              You can download individual photos${gallery.allow_bulk_download ? ' or all photos at once' : ''} from your gallery.
            </p>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by VK Creative. If you have any questions, please reply to this email.
          </p>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send gallery email:", err)
    return { error: "Failed to send email" }
  }
}
