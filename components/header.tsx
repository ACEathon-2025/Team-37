"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isWiggling, setIsWiggling] = useState(false)

  const handleLogoClick = () => {
    setIsWiggling(true)
    setTimeout(() => setIsWiggling(false), 1000)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-4 border-primary/20 bg-white/90 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLogoClick}>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:scale-110 transition-transform ${isWiggling ? "animate-wiggle" : ""}`}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EmoLearn
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors hover:scale-110 transform"
            >
              Fun Features
            </Link>
            <Link
              href="#demo"
              className="text-lg font-medium text-foreground hover:text-secondary transition-colors hover:scale-110 transform"
            >
              How It Works
            </Link>
            <Link
              href="#impact"
              className="text-lg font-medium text-foreground hover:text-accent transition-colors hover:scale-110 transform"
            >
              Why It's Cool
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              size="lg"
              className="gap-2 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-primary to-secondary"
              asChild
            >
              <Link href="/dashboard">
                <Star className="h-5 w-5" />
                Start Learning!
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
