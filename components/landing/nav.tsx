"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
const [isHeaderVisible, setIsHeaderVisible] = useState(true)

useEffect(() => {
  let lastScrollY = window.scrollY
  let idleTimer: NodeJS.Timeout

  const showHeader = () => {
    setIsHeaderVisible(true)
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      setIsHeaderVisible(false)
    }, 2000)
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    setIsScrolled(currentScrollY > 20)

    // Scroll up → show header
    if (currentScrollY < lastScrollY) {
      showHeader()
    }

    lastScrollY = currentScrollY
  }

  const handleMouseMove = (e: MouseEvent) => {
    // Hover near top (Windows 11 style)
    if (e.clientY <= 20) {
      showHeader()
    }
  }

  window.addEventListener("scroll", handleScroll)
  window.addEventListener("mousemove", handleMouseMove)

  return () => {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("mousemove", handleMouseMove)
    clearTimeout(idleTimer)
  }
}, [])


  const navLinks = [
    { href: "#how-it-works", label: "Technology" },
    { href: "#impact", label: "Impact" },
    { href: "#pricing", label: "Pricing" }
  ]

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setIsMobileMenuOpen(false)
      }
    }
  }

  return (
    <motion.header
  initial={{ y: -100 }}
  animate={{ y: isHeaderVisible ? 0 : -100 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <VisionAILogo size="md" />
          </Link>

          {/* Desktop Navigation - centered minimal links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground py-2 transition-colors"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
