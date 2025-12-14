import { LandingNav } from "@/components/landing/nav"
import { LandingHero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Impact } from "@/components/landing/impact"
import { WhyExists } from "@/components/landing/why-exists"
import { LandingCTA } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <Impact />
      <WhyExists />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
