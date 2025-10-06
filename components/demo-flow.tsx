"use client"

import { Card } from "@/components/ui/card"
import { Upload, MessageCircle, Award, Calendar, LineChart } from "lucide-react"
import { useState } from "react"

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Upload Your Stuff",
    description: "Add your homework or notes and we'll make fun quizzes for you!",
    color: "from-primary to-primary/70",
  },
  {
    number: "2",
    icon: MessageCircle,
    title: "Learn Together",
    description: "Chat with your AI friend who helps you understand everything!",
    color: "from-secondary to-secondary/70",
  },
  {
    number: "3",
    icon: Award,
    title: "Earn Cool Rewards",
    description: "Get points and badges for being awesome at learning!",
    color: "from-accent to-accent/70",
  },
  {
    number: "4",
    icon: Calendar,
    title: "Make Your Plan",
    description: "Create a study schedule that works just for you!",
    color: "from-chart-1 to-chart-1/70",
  },
  {
    number: "5",
    icon: LineChart,
    title: "See Your Progress",
    description: "Watch yourself get better with fun charts and graphs!",
    color: "from-chart-2 to-chart-2/70",
  },
]

export function DemoFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section id="demo" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-balance text-5xl font-bold lg:text-7xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            How Does It Work?
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-2xl font-medium text-foreground/80 leading-relaxed">
            Follow these easy steps to start your learning adventure!
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary via-accent via-chart-1 to-chart-2 rounded-full lg:left-1/2" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              return (
                <div
                  key={index}
                  className="relative flex items-center gap-8"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div
                    className={`absolute left-0 flex h-24 w-24 items-center justify-center rounded-full border-8 border-white bg-gradient-to-br ${step.color} shadow-xl lg:left-1/2 lg:-translate-x-1/2 transition-all ${isActive ? "scale-125 rotate-12" : ""}`}
                  >
                    <span className="text-4xl font-bold text-white">{step.number}</span>
                  </div>

                  <div className="ml-32 w-full lg:ml-0 lg:w-5/12 lg:ml-auto lg:pl-20">
                    <Card
                      className={`border-4 bg-white p-8 transition-all duration-300 ${isActive ? "scale-105 shadow-2xl" : "shadow-lg"}`}
                    >
                      <div
                        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-4 text-3xl font-bold text-foreground">{step.title}</h3>
                      <p className="text-xl text-foreground/70 leading-relaxed font-medium">{step.description}</p>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
