import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

const sessions = [
  {
    subject: "Mathematics",
    topic: "Linear Algebra",
    time: "Today, 3:00 PM",
    duration: "60 min",
  },
  {
    subject: "Physics",
    topic: "Quantum Mechanics",
    time: "Tomorrow, 10:00 AM",
    duration: "45 min",
  },
  {
    subject: "Chemistry",
    topic: "Thermodynamics",
    time: "Wed, 2:00 PM",
    duration: "50 min",
  },
]

export function UpcomingSessions() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
        <Button variant="ghost" size="sm" asChild>
          <a href="/dashboard/planner">View All</a>
        </Button>
      </div>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div key={index} className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="mb-1 font-medium">{session.subject}</p>
            <p className="mb-2 text-sm text-muted-foreground">{session.topic}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{session.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{session.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
