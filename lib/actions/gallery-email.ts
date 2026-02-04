"use server"

import { Resend } from "resend"
import { createClient, isAdmin } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

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

  try {
    await resend.emails.send({
      from: "VK Creative <gallery@vkcreative.com>",
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

export async function sendClientInviteEmail(clientId: string, galleryId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single()

  const { data: gallery } = await supabase
    .from("client_galleries")
    .select("*")
    .eq("id", galleryId)
    .single()

  if (!client || !gallery) {
    return { error: "Client or gallery not found" }
  }

  const registerUrl = `${siteUrl}/client/register?email=${encodeURIComponent(client.email)}`

  try {
    await resend.emails.send({
      from: "VK Creative <gallery@vkcreative.com>",
      to: client.email,
      subject: `You're Invited to View Your Gallery`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin-bottom: 10px;">You're Invited!</h1>
          </div>

          <p>Hi ${client.name},</p>

          <p>You've been invited to create an account and access your <strong>${gallery.name}</strong> gallery.</p>

          <p>With your account, you'll be able to:</p>
          <ul>
            <li>View all your galleries in one place</li>
            <li>Download your photos and videos</li>
            <li>Access your galleries anytime</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${registerUrl}"
               style="background-color: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Create Your Account
            </a>
          </div>

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
    console.error("Failed to send invite email:", err)
    return { error: "Failed to send email" }
  }
}
