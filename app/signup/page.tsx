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
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"
import { validateSignupForm } from "@/lib/validation"

const benefits = ["Free for individual users", "No credit card required", "Instant access to all features"]

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Clear field error when user starts typing
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: [] }))
    setGeneralError(null)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    // Client-side validation
    const validation = validateSignupForm({
      fullName,
      email,
      password,
      confirmPassword,
    })

    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors)
      return
    }

    setIsLoading(true)
    setFieldErrors({})

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        // Map Supabase errors to user-friendly messages
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          setFieldErrors({ email: ["This email is already registered. Please sign in instead."] })
        } else if (error.message.includes("Password")) {
          setFieldErrors({ password: [error.message] })
        } else if (error.message.includes("rate limit")) {
          setGeneralError("Too many signup attempts. Please wait a moment and try again.")
        } else {
          setGeneralError(error.message)
        }
        return
      }

      if (data.user) {
        router.push("/signup/success")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setGeneralError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start saving lives with Vision-AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-success" />
                  {benefit}
                </div>
              ))}
            </div>

            <form onSubmit={handleSignUp} noValidate>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Rajesh Kumar"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      clearFieldError("fullName")
                    }}
                    className={`bg-background/50 ${fieldErrors.fullName?.length ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                  {fieldErrors.fullName?.map((error, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rajesh@company.com"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError("email")
                    }}
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
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError("password")
                    }}
                    className={`bg-background/50 ${fieldErrors.password?.length ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {fieldErrors.password?.map((error, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {error}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError("confirmPassword")
                    }}
                    className={`bg-background/50 ${fieldErrors.confirmPassword?.length ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirmPassword?.map((error, i) => (
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
