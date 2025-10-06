import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { StressInsights } from "@/components/dashboard/stress-insights"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground">Here's your learning progress today</p>
        </div>

        <StatsOverview />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickActions />
            <div className="mt-6">
              <RecentActivity />
            </div>
          </div>
          <div className="space-y-6">
            <UpcomingSessions />
            <StressInsights />
          </div>
        </div>
      </main>
    </div>
  )
}
