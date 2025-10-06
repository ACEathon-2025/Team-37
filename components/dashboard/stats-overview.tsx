import { Card } from "@/components/ui/card"
import { Trophy, Flame, Target, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Trophy,
    label: "Total XP",
    value: "2,450",
    change: "+125 this week",
    trend: "up",
  },
  {
    icon: Flame,
    label: "Current Streak",
    value: "12 days",
    change: "Keep it up!",
    trend: "up",
  },
  {
    icon: Target,
    label: "Quizzes Completed",
    value: "34",
    change: "+5 today",
    trend: "up",
  },
  {
    icon: TrendingUp,
    label: "Avg. Stress Level",
    value: "Low",
    change: "Improved 15%",
    trend: "up",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
