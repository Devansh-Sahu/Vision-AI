import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">Last updated: December 13, 2023</p>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Vision-AI's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Vision-AI provides AI-powered computer vision solutions for road safety and hazard detection. Our services include real-time analysis of visual data to identify potential hazards and provide safety alerts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To access certain features of our services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Use of Services</h2>
          <p className="mb-2">You agree not to use our services to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Violate any laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Transmit harmful or malicious code</li>
            <li>Interfere with or disrupt the integrity or performance of our services</li>
            <li>Attempt to gain unauthorized access to our systems or networks</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials available on our services, including but not limited to text, graphics, logos, and software, are the property of Vision-AI or its licensors and are protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, Vision-AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the updated terms on our website and updating the "Last Updated" date at the top of these terms.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <Button asChild>
            <Link href="/about#contact">Contact Us</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
