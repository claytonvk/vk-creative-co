"use client"

import { useState, useEffect, Suspense } from "react"
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
import { clientLogin, clientRegister, checkClientEmail, isClient } from "@/lib/actions/client-auth"

type Step = "email" | "sign_in" | "set_password"

function LoginFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const galleryParam = searchParams.get("gallery") || ""

  const [step, setStep] = useState<Step>("email")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(!!emailParam)
  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  const redirectPath = galleryParam ? `/gallery/${galleryParam}` : "/client"

  useEffect(() => {
    isClient().then((authed) => {
      if (authed) router.replace(redirectPath)
    })
  }, [router, redirectPath])

  // Auto-check email from URL params on mount
  useEffect(() => {
    if (!emailParam) return
    handleEmailCheck(emailParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam])

  async function handleEmailCheck(emailToCheck: string) {
    setIsChecking(true)
    try {
      const result = await checkClientEmail(emailToCheck)
      if (result.status === "not_found") {
        toast.error("No account found. Contact VK Creative for access.")
        setStep("email")
      } else if (result.status === "sign_in") {
        setStep("sign_in")
      } else {
        setName(result.clientName || "")
        setStep("set_password")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsChecking(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    await handleEmailCheck(email)
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const form = new FormData()
    form.append("email", email)
    form.append("password", password)

    try {
      const result = await clientLogin(form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Welcome back!")
      router.push(redirectPath)
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const form = new FormData()
    form.append("email", email)
    form.append("password", password)
    form.append("name", name)

    try {
      const result = await clientRegister(form)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Account created!")
      router.push(redirectPath)
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  function handleBack() {
    setStep("email")
    setPassword("")
    setConfirmPassword("")
  }

  if (isChecking) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Checking your email...
        </CardContent>
      </Card>
    )
  }

  if (step === "email") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Client Portal</CardTitle>
          <CardDescription>
            Enter your email to access your galleries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:underline">
            Back to website
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (step === "sign_in") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your galleries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-center text-sm">
          <button
            type="button"
            onClick={handleBack}
            className="text-muted-foreground hover:underline cursor-pointer"
          >
            Use a different email
          </button>
          <Link href="/" className="text-muted-foreground hover:underline">
            Back to website
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // step === "set_password"
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Set up your account to access your galleries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus={!name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus={!!name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm">
        <button
          type="button"
          onClick={handleBack}
          className="text-muted-foreground hover:underline cursor-pointer"
        >
          Use a different email
        </button>
        <Link href="/" className="text-muted-foreground hover:underline">
          Back to website
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function ClientLoginPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    }>
      <LoginFlow />
    </Suspense>
  )
}
