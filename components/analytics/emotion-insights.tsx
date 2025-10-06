"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingDown } from "lucide-react"

const emotionData = [
  { emotion: "Calm", percentage: 65, color: "chart-3" },
  { emotion: "Focused", percentage: 75, color: "primary" },
  { emotion: "Stressed", percentage: 20, color: "destructive" },
  { emotion: "Confused", percentage: 15, color: "chart-2" },
]

const insights = [
  {
    title: "Best Performance Time",
    value: "Morning (9-11 AM)",
    description: "You score 15% higher during morning sessions",
  },
  {
    title: "Stress Triggers",
    value: "Complex Math Problems",
    description: "Consider breaking down problems into smaller steps",
  },
  {
    title: "Optimal Session Length",
    value: "45 minutes",
    description: "Your focus peaks at 30-45 minute sessions",
  },
]

export function EmotionInsights() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
          <Heart className="h-4 w-4 text-chart-3" />
        </div>
        <h2 className="text-xl font-semibold">Emotion Insights</h2>
      </div>

      <div className="mb-6 space-y-4">
        {emotionData.map((item) => (
          <div key={item.emotion}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{item.emotion}</span>
              <span className="text-muted-foreground">{item.percentage}%</span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendingDown className="h-4 w-4 text-chart-3" />
          <span>Key Insights</span>
        </div>
        {insights.map((insight, index) => (
          <div key={index} className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="mb-1 text-sm font-medium">{insight.title}</p>
            <p className="mb-1 text-sm text-primary">{insight.value}</p>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
