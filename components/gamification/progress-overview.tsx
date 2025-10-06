import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target } from "lucide-react"

const stats = [
  {
    icon: Trophy,
    label: "Total XP",
    value: "2,450",
    max: "3,000",
    progress: 82,
    color: "primary",
  },
  {
    icon: Star,
    label: "Level",
    value: "12",
    max: "15",
    progress: 80,
    color: "accent",
  },
  {
    icon: Zap,
    label: "Streak",
    value: "12 days",
    max: "30 days",
    progress: 40,
    color: "chart-2",
  },
  {
    icon: Target,
    label: "Achievements",
    value: "18",
    max: "25",
    progress: 72,
    color: "chart-3",
  },
]

export function ProgressOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}/10`}>
                <Icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
              <span className="text-sm text-muted-foreground">
                {stat.value} / {stat.max}
              </span>
            </div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            <Progress value={stat.progress} className="h-2" />
          </Card>
        )
      })}
    </div>
  )
}
