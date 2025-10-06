import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AchievementsGrid } from "@/components/gamification/achievements-grid"
import { LeaderboardSection } from "@/components/gamification/leaderboard-section"
import { ProgressOverview } from "@/components/gamification/progress-overview"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Achievements & Rewards</h1>
          <p className="text-muted-foreground">Track your progress and compete with others</p>
        </div>

        <ProgressOverview />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AchievementsGrid />
          </div>
          <div>
            <LeaderboardSection />
          </div>
        </div>
      </main>
    </div>
  )
}
