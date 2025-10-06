"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Star, Smile } from "lucide-react"
import { useState } from "react"

export function Hero() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl animate-bounce-gentle" />
        <div
          className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/2 h-[350px] w-[350px] rounded-full bg-accent/20 blur-3xl animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border-4 border-primary/30 bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 text-lg font-bold text-primary shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setClickCount(clickCount + 1)}
          >
            <Sparkles className="h-6 w-6 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Click me! {clickCount > 0 && `(${clickCount} clicks!)`}</span>
          </div>

          <h1 className="mb-8 text-balance text-6xl font-bold leading-tight tracking-tight lg:text-8xl">
            Learn About Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-flex items-center gap-4">
              Feelings!
              <Heart className="inline h-16 w-16 lg:h-24 lg:w-24 text-chart-1 animate-pulse" />
            </span>
          </h1>

          <p className="mb-12 text-pretty text-2xl font-medium text-foreground/80 lg:text-3xl leading-relaxed">
            A super fun way to learn that understands how you feel and helps you learn better!
            <Smile className="inline h-8 w-8 ml-2 text-accent" />
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              size="lg"
              className="gap-3 text-xl font-bold px-8 py-7 shadow-xl hover:shadow-2xl hover:scale-110 transition-all bg-gradient-to-r from-primary to-secondary rounded-2xl"
            >
              <Star className="h-6 w-6" />
              Start Learning Free!
              <ArrowRight className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-3 text-xl font-bold px-8 py-7 border-4 hover:bg-accent/20 hover:scale-110 transition-all rounded-2xl bg-transparent"
            >
              <Sparkles className="h-6 w-6" />
              Watch Fun Video
            </Button>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-6 text-lg font-semibold">
            <div className="flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full border-2 border-primary/30 hover:scale-105 transition-transform">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              <span className="text-primary">Knows How You Feel</span>
            </div>
            <div className="flex items-center gap-3 bg-secondary/10 px-6 py-3 rounded-full border-2 border-secondary/30 hover:scale-105 transition-transform">
              <div className="h-4 w-4 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
              <span className="text-secondary">Smart Helper</span>
            </div>
            <div className="flex items-center gap-3 bg-accent/10 px-6 py-3 rounded-full border-2 border-accent/30 hover:scale-105 transition-transform">
              <div className="h-4 w-4 rounded-full bg-accent animate-pulse" style={{ animationDelay: "1s" }} />
              <span className="text-accent">Fun Games!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
