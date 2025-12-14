import Link from "next/link"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Impact", href: "#impact" },
    { label: "Vision-AI Demo", href: "/dualvision" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Research", href: "/research" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Why Vision-AI", href: "#why-vision-ai" },
    { label: "Contact Us", href: "/about#contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <VisionAILogo size="md" />
            <p className="mt-4 text-sm text-muted-foreground">
              Vision-AI Safety Engine - AI-powered accident prevention across World.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vision-AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about#contact" className="text-sm font-medium hover:text-foreground transition-colors">
              Contact Us
            </Link>
            <span className="text-sm text-muted-foreground">Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
