"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })

            if (error) throw error

            router.push("/dashboard?message=Password updated successfully")
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to update password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

            <div className="relative z-10 w-full max-w-md">
                <Card className="bg-card/80 backdrop-blur border-border">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <VisionAILogo size="lg" />
                        </div>
                        <CardTitle className="text-2xl">Set New Password</CardTitle>
                        <CardDescription>
                            Please enter your new password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
