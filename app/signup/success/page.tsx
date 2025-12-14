import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-success/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-card/80 backdrop-blur border-border text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
                  <Mail className="h-10 w-10 text-success" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success-foreground" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and access your Vision-AI dashboard.
            </p>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  try signing up again
                </Link>
                .
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <Link
                href="/login"
                className="block w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Back to sign in
              </Link>
              <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Return to homepage
              </Link>
            </div>

            <div className="flex justify-center pt-4">
              <VisionAILogo size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
