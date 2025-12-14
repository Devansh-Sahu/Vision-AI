import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResearchPage() {
  const researchPapers = [
    {
      title: "Real-time Hazard Detection in Road Scenes using Deep Learning",
      authors: "Vision-AI Research Team",
      year: 2023,
      abstract: "This paper presents our novel approach to real-time hazard detection in road scenes using state-of-the-art computer vision techniques.",
      link: "#"
    },
    {
      title: "Improving Road Safety with AI: A Comprehensive Study",
      authors: "Vision-AI Research Team",
      year: 2023,
      abstract: "An in-depth analysis of how AI can be leveraged to improve road safety and prevent accidents.",
      link: "#"
    },
    {
      title: "Benchmarking Computer Vision Models for Traffic Analysis",
      authors: "Vision-AI Research Team",
      year: 2023,
      abstract: "Comparative study of various computer vision models for traffic analysis and hazard detection.",
      link: "#"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Research</h1>
        <p className="text-xl text-muted-foreground">Latest research and publications from Vision-AI</p>
      </div>
      
      <div className="space-y-8">
        {researchPapers.map((paper, index) => (
          <div key={index} className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-2xl font-semibold mb-2">{paper.title}</h2>
            <p className="text-muted-foreground mb-4">{paper.authors} • {paper.year}</p>
            <p className="mb-4">{paper.abstract}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={paper.link}>Read Paper</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Interested in our research?</h2>
        <p className="text-muted-foreground mb-6">Contact our research team for collaborations and inquiries</p>
        <Button asChild>
          <Link href="/about#contact">Contact Research Team</Link>
        </Button>
      </div>
    </div>
  )
}
