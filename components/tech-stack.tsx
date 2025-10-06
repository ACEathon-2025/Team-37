import { Card } from "@/components/ui/card"
import { Code2, Brain, Database, BarChart2 } from "lucide-react"

const techCategories = [
  {
    icon: Code2,
    title: "Frontend & Backend",
    items: [
      "Frontend: React.js for a responsive user interface",
      "WebRTC: For real-time webcam and microphone access",
      "Backend: Flask / Node.js for scalable server-side operations",
    ],
  },
  {
    icon: Brain,
    title: "AI & Content Processing",
    items: [
      "Stress Detection: DeepFace / FER (facial emotion recognition) and librosa (voice analysis)",
      "Quiz & Notes Generation: Hugging Face Transformers and OpenAI/Gemini API for advanced NLP",
      "Content Parsing: PyPDF2 / pdfplumber for extracting information from documents",
    ],
  },
  {
    icon: Database,
    title: "Data & Visualization",
    items: [
      "Database: MongoDB / Firebase for flexible and scalable data storage",
      "Visualization: Chart.js / Recharts for interactive and insightful dashboards",
    ],
  },
  {
    icon: BarChart2,
    title: "Engagement Layer",
    items: ["Gamification: Frontend logic integrated with a robust point and reward system"],
  },
]

export function TechStack() {
  return (
    <section id="tech" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold lg:text-5xl">Our Robust Technology Stack</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Built with cutting-edge technologies to deliver a seamless and intelligent learning experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {techCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
