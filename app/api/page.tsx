import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function APIPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-muted-foreground">Comprehensive API documentation for Vision-AI integration</p>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
            <p>Authorization: Bearer YOUR_API_KEY</p>
          </div>
          <p className="text-muted-foreground mb-4">
            All API requests require an API key for authentication.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Analyze Image</h3>
              <div className="bg-muted p-4 rounded-lg mb-2 font-mono text-sm">
                <p>POST /api/v1/analyze</p>
              </div>
              <p className="text-muted-foreground">
                Analyze an image for potential hazards and road conditions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Get Analysis</h3>
              <div className="bg-muted p-4 rounded-lg mb-2 font-mono text-sm">
                <p>GET /api/v1/analysis/&#123;id&#125;</p>
              </div>
              <p className="text-muted-foreground">
                Retrieve the results of a previous analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/docs">View Full Documentation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
