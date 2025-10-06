import { Card } from "@/components/ui/card"
import { Heart, TrendingDown } from "lucide-react"

export function StressInsights() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
          <Heart className="h-4 w-4 text-chart-3" />
        </div>
        <h2 className="text-lg font-semibold">Stress Insights</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Level</span>
            <span className="text-sm font-medium text-chart-3">Low</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/4 rounded-full bg-chart-3" />
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-background/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-chart-3" />
            <p className="text-sm font-medium">Great Progress!</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your stress levels have decreased by 15% this week. Keep maintaining your study routine!
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Recommended Actions</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>Take a 5-minute break every hour</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>Practice breathing exercises before quizzes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>Review easier topics when feeling stressed</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
