"use client"

import { Card } from "@/components/ui/card"
import { Camera, Zap, BookOpen, Heart, TrendingUp } from "lucide-react"
import { useState } from "react"

const goals = [
  {
    icon: Camera,
    number: "1",
    title: "Knows Your Feelings",
    description: "Uses your camera and voice to tell when you're feeling stressed!",
    color: "from-primary to-primary/70",
  },
  {
    icon: Zap,
    number: "2",
    title: "Changes For You",
    description: "Makes lessons easier or harder based on how you're feeling!",
    color: "from-secondary to-secondary/70",
  },
  {
    icon: BookOpen,
    number: "3",
    title: "Keeps You Organized",
    description: "Helps you keep notes tidy and plan your study time!",
    color: "from-accent to-accent/70",
  },
  {
    icon: Heart,
    number: "4",
    title: "Cares About You",
    description: "Gives you breaks, cheers you on, and makes learning fun!",
    color: "from-chart-1 to-chart-1/70",
  },
  {
    icon: TrendingUp,
    number: "5",
    title: "Shows Your Progress",
    description: "See how much you've learned with cool charts and achievements!",
    color: "from-chart-2 to-chart-2/70",
  },
]

export function Solution() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-accent/5 to-primary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-balance text-5xl font-bold lg:text-7xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            How We Make It Better!
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-2xl font-medium text-foreground/80 leading-relaxed">
            All the awesome ways EmoLearn helps you learn better and have more fun!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {goals.map((goal, index) => {
            const Icon = goal.icon
            const isHovered = hoveredIndex === index
            return (
              <Card
                key={index}
                className={`relative overflow-hidden border-4 bg-white p-8 transition-all duration-300 cursor-pointer ${
                  isHovered ? "scale-110 shadow-2xl -translate-y-2" : "shadow-lg"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`absolute top-4 right-4 text-8xl font-bold transition-all ${isHovered ? "scale-125 rotate-12" : ""}`}
                >
                  <span className="bg-gradient-to-br from-primary/10 to-secondary/10 bg-clip-text text-transparent">
                    {goal.number}
                  </span>
                </div>
                <div className="relative">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${goal.color} shadow-lg transition-transform ${isHovered ? "rotate-12 scale-110" : ""}`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-foreground">{goal.title}</h3>
                  <p className="text-xl text-foreground/70 leading-relaxed font-medium">{goal.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
