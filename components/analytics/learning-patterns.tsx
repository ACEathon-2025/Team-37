import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Target, TrendingUp } from "lucide-react"

const patterns = [
  {
    icon: Clock,
    title: "Study Time Distribution",
    insights: [
      { label: "Peak Hours", value: "9 AM - 11 AM", badge: "Optimal" },
      { label: "Avg. Session", value: "42 minutes", badge: "Good" },
      { label: "Total This Week", value: "8.5 hours", badge: "On Track" },
    ],
  },
  {
    icon: Calendar,
    title: "Consistency Metrics",
    insights: [
      { label: "Current Streak", value: "12 days", badge: "Strong" },
      { label: "Weekly Goal", value: "5/5 days", badge: "Complete" },
      { label: "Best Streak", value: "18 days", badge: "Record" },
    ],
  },
  {
    icon: Target,
    title: "Learning Efficiency",
    insights: [
      { label: "Avg. Quiz Score", value: "85%", badge: "Excellent" },
      { label: "Improvement Rate", value: "+12%", badge: "Rising" },
      { label: "Completion Rate", value: "94%", badge: "High" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Growth Indicators",
    insights: [
      { label: "XP Growth", value: "+25%", badge: "Accelerating" },
      { label: "Difficulty Level", value: "Intermediate", badge: "Advancing" },
      { label: "Topics Mastered", value: "8 new", badge: "Expanding" },
    ],
  },
]

export function LearningPatterns() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-semibold">Learning Patterns</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {patterns.map((pattern, index) => {
          const Icon = pattern.icon
          return (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{pattern.title}</h3>
              </div>

              <div className="space-y-3">
                {pattern.insights.map((insight, idx) => (
                  <div key={idx} className="rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{insight.label}</p>
                      <Badge variant="secondary" className="text-xs">
                        {insight.badge}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{insight.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
