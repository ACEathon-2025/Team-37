import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PerformanceCharts } from "@/components/analytics/performance-charts"
import { EmotionInsights } from "@/components/analytics/emotion-insights"
import { SubjectBreakdown } from "@/components/analytics/subject-breakdown"
import { LearningPatterns } from "@/components/analytics/learning-patterns"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">Track your performance and emotional well-being</p>
        </div>

        <div className="space-y-8">
          <PerformanceCharts />

          <div className="grid gap-8 lg:grid-cols-2">
            <EmotionInsights />
            <SubjectBreakdown />
          </div>

          <LearningPatterns />
        </div>
      </main>
    </div>
  )
}
