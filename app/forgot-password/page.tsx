"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            })

            if (error) {
                throw error
            }

            setIsSubmitted(true)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            {/* Background blobs matches login page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>

                <Card className="bg-card/80 backdrop-blur border-border">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <VisionAILogo size="lg" />
                        </div>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email to receive a password reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4 py-4">
                                <div className="flex justify-center">
                                    <CheckCircle2 className="h-12 w-12 text-success" />
                                </div>
                                <h3 className="text-lg font-medium">Check your email</h3>
                                <p className="text-muted-foreground text-sm">
                                    We have sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                                </p>
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link href="/login">Return to Login</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
