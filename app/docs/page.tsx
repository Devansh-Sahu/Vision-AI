import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground">Comprehensive guides and documentation for Vision-AI</p>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            Learn how to integrate Vision-AI into your applications with our quick start guide.
          </p>
          <Button asChild>
            <Link href="/docs/getting-started">View Guide</Link>
          </Button>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          <p className="text-muted-foreground mb-4">
            Detailed documentation for all Vision-AI API endpoints and parameters.
          </p>
          <Button asChild variant="outline">
            <Link href="/api">View API Reference</Link>
          </Button>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-4">Tutorials</h2>
          <p className="text-muted-foreground mb-4">
            Step-by-step tutorials to help you make the most of Vision-AI.
          </p>
          <Button asChild variant="outline">
            <Link href="/docs/tutorials">View Tutorials</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
