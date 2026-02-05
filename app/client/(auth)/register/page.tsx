import { redirect } from "next/navigation"

export default async function ClientRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const email = typeof params.email === "string" ? params.email : ""
  const gallery = typeof params.gallery === "string" ? params.gallery : ""

  const loginParams = new URLSearchParams()
  if (email) loginParams.set("email", email)
  if (gallery) loginParams.set("gallery", gallery)

  const query = loginParams.toString()
  redirect(`/client/login${query ? `?${query}` : ""}`)
}
