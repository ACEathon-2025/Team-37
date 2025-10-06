"use client"

import { Card } from "@/components/ui/card"
import { FileQuestion, Brain, Camera, Wind, MessageSquare, BarChart3, NotebookPen, Trophy } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: FileQuestion,
    title: "Quiz Maker",
    description: "Turn your homework into fun quizzes automatically!",
    color: "from-primary to-primary/70",
  },
  {
    icon: Brain,
    title: "Smart Learning Path",
    description: "Get a special plan just for you based on what you need help with!",
    color: "from-secondary to-secondary/70",
  },
  {
    icon: Camera,
    title: "Feeling Detector",
    description: "Knows when you're stressed and helps you feel better!",
    color: "from-accent to-accent/70",
  },
  {
    icon: Wind,
    title: "Calm Down Breaks",
    description: "Take fun breaks with breathing games and relaxing music!",
    color: "from-chart-1 to-chart-1/70",
  },
  {
    icon: MessageSquare,
    title: "Friendly Helper",
    description: "Chat with a super nice AI friend who explains things simply!",
    color: "from-chart-2 to-chart-2/70",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description: "See how awesome you're doing with cool charts and graphs!",
    color: "from-chart-3 to-chart-3/70",
  },
  {
    icon: NotebookPen,
    title: "Note Organizer",
    description: "Keep all your notes neat and plan your study time!",
    color: "from-primary to-secondary",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Get points, badges, and unlock cool stuff as you learn!",
    color: "from-accent to-chart-1",
  },
]

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-balance text-5xl font-bold lg:text-7xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Super Cool Features!
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-2xl font-medium text-foreground/80 leading-relaxed">
            All the amazing things you can do with EmoLearn!
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredIndex === index
            return (
              <Card
                key={index}
                className={`group border-4 bg-white p-8 transition-all duration-300 cursor-pointer ${
                  isHovered ? "scale-110 shadow-2xl -translate-y-2" : "hover:scale-105 hover:shadow-xl"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition-transform ${isHovered ? "rotate-12 scale-110" : ""}`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
