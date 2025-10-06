"use client"

import { Card } from "@/components/ui/card"
import { GraduationCap, Users, Building2 } from "lucide-react"
import { useState } from "react"

const impacts = [
  {
    icon: GraduationCap,
    title: "For Kids Like You!",
    description: "Learn in a way that's perfect for you, stay organized, and have fun earning rewards!",
    color: "from-primary to-secondary",
  },
  {
    icon: Users,
    title: "For Teachers & Parents",
    description: "See how kids are feeling and help them learn better and stay happy!",
    color: "from-secondary to-accent",
  },
  {
    icon: Building2,
    title: "For Schools",
    description: "A new way of teaching that cares about how students feel while they learn!",
    color: "from-accent to-chart-1",
  },
]

export function Impact() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="impact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-balance text-5xl font-bold lg:text-7xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Who Does This Help?
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-2xl font-medium text-foreground/80 leading-relaxed">
            EmoLearn makes learning better for everyone!
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
          {impacts.map((impact, index) => {
            const Icon = impact.icon
            const isHovered = hoveredIndex === index
            return (
              <Card
                key={index}
                className={`border-4 bg-white p-10 text-center transition-all duration-300 cursor-pointer ${
                  isHovered ? "scale-110 shadow-2xl -translate-y-4" : "shadow-lg"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${impact.color} shadow-xl transition-transform ${isHovered ? "rotate-12 scale-110" : ""}`}
                >
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-foreground">{impact.title}</h3>
                <p className="text-xl text-foreground/70 leading-relaxed font-medium">{impact.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
