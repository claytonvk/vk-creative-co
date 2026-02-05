"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`

const logoHtml = `
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="${siteUrl}/images/logo.png" alt="VK Film & Photo Studios" style="width: 150px; height: auto;" />
  </div>
`

type ContactFormPayload = {
  name: string
  email: string
  phone?: string
  eventType?: string
  eventDate?: string
  message: string
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function formatEventType(eventType?: string) {
  if (!eventType) return ""
  const map: Record<string, string> = {
    wedding: "Wedding",
    engagement: "Engagement",
    brand: "Brand / Commercial",
    lifestyle: "Lifestyle / Portrait",
    other: "Other",
  }
  return map[eventType] || eventType
}

export async function sendContactFormEmail(payload: ContactFormPayload) {
  try {
    if (!payload?.name || !payload?.email || !payload?.message) {
      return { error: "Missing required fields" }
    }

    const safe = {
      name: escapeHtml(payload.name),
      email: escapeHtml(payload.email),
      phone: payload.phone ? escapeHtml(payload.phone) : "",
      eventType: escapeHtml(formatEventType(payload.eventType)),
      eventDate: payload.eventDate ? escapeHtml(payload.eventDate) : "",
      message: escapeHtml(payload.message),
    }

    await resend.emails.send({
      // IMPORTANT: this domain must be verified in Resend
      from: "VK Film & Photo Studios <forms@vkfilmandphoto.com>",
      to: "vkfilmandphotostudios@gmail.com",
      replyTo: payload.email,
      subject: `New Inquiry — ${safe.name}${safe.eventType ? ` (${safe.eventType})` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #222; max-width: 640px; margin: 0 auto; padding: 20px;">
          ${logoHtml}

          <h1 style="margin: 0 0 16px; font-size: 22px;">New Form Submission</h1>

          <div style="border: 1px solid #eee; border-radius: 10px; padding: 16px; background: #fafafa;">
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safe.name}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
            ${safe.phone ? `<p style="margin: 0 0 8px;"><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>` : ""}
            ${safe.eventType ? `<p style="margin: 0 0 8px;"><strong>Event Type:</strong> ${safe.eventType}</p>` : ""}
            ${safe.eventDate ? `<p style="margin: 0;"><strong>Preferred Date:</strong> ${safe.eventDate}</p>` : ""}
          </div>

          <h2 style="margin: 18px 0 8px; font-size: 16px;">Message</h2>
          <div style="white-space: pre-wrap; border-left: 3px solid #111; padding-left: 12px;">
            ${safe.message}
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <p style="color: #888; font-size: 12px; margin: 0;">
            This email was sent from your website contact form.
          </p>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Failed to send contact form email:", err)
    return { error: "Failed to send email" }
  }
}
