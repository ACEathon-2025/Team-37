"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, Lock, FolderX, MessageSquareOff } from "lucide-react"
import { useState } from "react"

const problems = [
  {
    icon: AlertCircle,
    title: "Same For Everyone",
    description: "Other learning apps give everyone the same stuff, which can be boring and frustrating!",
    color: "from-destructive to-destructive/70",
  },
  {
    icon: Lock,
    title: "Too Strict",
    description: "They don't change when you're feeling stressed or need to go slower!",
    color: "from-chart-1 to-chart-1/70",
  },
  {
    icon: FolderX,
    title: "Hard to Organize",
    description: "It's tough to keep your notes neat and plan when to study!",
    color: "from-primary to-primary/70",
  },
  {
    icon: MessageSquareOff,
    title: "No Help",
    description: "They don't give you feedback or cheer you on when you're doing great!",
    color: "from-secondary to-secondary/70",
  },
]

export function Problem() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-balance text-5xl font-bold lg:text-7xl text-foreground">
            Why Other Apps Are Not So Fun
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-2xl font-medium text-foreground/80 leading-relaxed">
            Here's what makes other learning apps not as cool as they could be
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            const isHovered = hoveredIndex === index
            return (
              <Card
                key={index}
                className={`border-4 bg-white p-8 transition-all duration-300 cursor-pointer ${
                  isHovered ? "scale-105 shadow-2xl -translate-y-2" : "shadow-lg"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${problem.color} shadow-lg transition-transform ${isHovered ? "rotate-12 scale-110" : ""}`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-foreground">{problem.title}</h3>
                <p className="text-xl text-foreground/70 leading-relaxed font-medium">{problem.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
