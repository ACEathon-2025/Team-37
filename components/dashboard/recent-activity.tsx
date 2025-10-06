import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Award } from "lucide-react"

const activities = [
  {
    icon: CheckCircle2,
    title: "Completed Mathematics Quiz",
    description: "Scored 85% on Calculus fundamentals",
    time: "2 hours ago",
    badge: "Quiz",
    badgeVariant: "default" as const,
  },
  {
    icon: Award,
    title: "Earned Achievement",
    description: "Unlocked 'Week Warrior' badge",
    time: "5 hours ago",
    badge: "Achievement",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Clock,
    title: "Study Session Completed",
    description: "Physics - 45 minutes",
    time: "Yesterday",
    badge: "Session",
    badgeVariant: "outline" as const,
  },
  {
    icon: CheckCircle2,
    title: "Completed Chemistry Quiz",
    description: "Scored 92% on Organic Chemistry",
    time: "2 days ago",
    badge: "Quiz",
    badgeVariant: "default" as const,
  },
]

export function RecentActivity() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{activity.title}</p>
                  <Badge variant={activity.badgeVariant} className="text-xs">
                    {activity.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
