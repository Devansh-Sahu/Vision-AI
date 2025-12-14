"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"
import { validateLoginForm } from "@/lib/validation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Clear field error when user starts typing
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setFieldErrors((prev) => ({ ...prev, email: [] }))
    setGeneralError(null)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFieldErrors((prev) => ({ ...prev, password: [] }))
    setGeneralError(null)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    // Client-side validation
    const validation = validateLoginForm({ email, password })
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors)
      return
    }

    setIsLoading(true)
    setFieldErrors({})

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        // Map Supabase errors to user-friendly messages
        if (error.message.includes("Invalid login credentials")) {
          setGeneralError("Invalid email or password. Please try again.")
        } else if (error.message.includes("Email not confirmed")) {
          setGeneralError("Please check your email and confirm your account before signing in.")
        } else if (error.message.includes("Too many requests")) {
          setGeneralError("Too many login attempts. Please wait a moment and try again.")
        } else {
          setGeneralError(error.message)
        }
        return
      }

      if (data.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setGeneralError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="bg-card/80 backdrop-blur border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <VisionAILogo size="lg" animate />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your Vision-AI dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} noValidate>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="driver@company.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`bg-background/50 ${fieldErrors.email?.length ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {fieldErrors.email?.map((error, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className={`bg-background/50 ${fieldErrors.password?.length ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  {fieldErrors.password?.map((error, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>

                {generalError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{generalError}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
