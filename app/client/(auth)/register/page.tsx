"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { clientRegister } from "@/lib/actions/client-auth"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromParams = searchParams.get("email") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: emailFromParams,
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const form = new FormData()
    form.append("email", formData.email)
    form.append("password", formData.password)
    form.append("name", formData.name)
    form.append("phone", formData.phone)

    try {
      const result = await clientRegister(form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Account created! Please check your email to confirm.")
      router.push("/client/login")
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Register to access your galleries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={!!emailFromParams}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/client/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <Link href="/" className="text-muted-foreground hover:underline">
          Back to website
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function ClientRegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
