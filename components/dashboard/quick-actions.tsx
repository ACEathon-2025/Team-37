import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileQuestion, MessageSquare, Calendar, Upload, ArrowRight } from "lucide-react"

const actions = [
  {
    icon: FileQuestion,
    title: "Take a Quiz",
    description: "Test your knowledge with adaptive quizzes",
    href: "/dashboard/quiz",
    color: "primary",
  },
  {
    icon: MessageSquare,
    title: "Chat with AI Tutor",
    description: "Get instant help with any topic",
    href: "/dashboard/tutor",
    color: "accent",
  },
  {
    icon: Calendar,
    title: "Plan Study Session",
    description: "Schedule your next learning session",
    href: "/dashboard/planner",
    color: "chart-3",
  },
  {
    icon: Upload,
    title: "Upload Materials",
    description: "Generate quizzes from your notes",
    href: "/dashboard/upload",
    color: "chart-2",
  },
]

export function QuickActions() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto justify-start gap-4 border-border/50 p-4 text-left hover:border-primary/50 bg-transparent"
              asChild
            >
              <a href={action.href}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-${action.color}/10`}>
                  <Icon className={`h-5 w-5 text-${action.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
