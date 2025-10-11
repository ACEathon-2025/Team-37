import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer"
import { TaskManager } from "@/components/pomodoro/task-manager"
import { PomodoroStats } from "@/components/pomodoro/pomodoro-stats"
import { PomodoroAchievements } from "@/components/pomodoro/pomodoro-achievements"
import { BreathingBreak } from "@/components/pomodoro/breathing-break"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PomodoroPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Focus better with the Pomodoro technique</p>
        </div>

        {/* Main Timer and Task Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <PomodoroTimer />
          </div>
          <div className="space-y-6">
            <TaskManager />
            <PomodoroAchievements />
          </div>
        </div>

        {/* Additional Features Tabs */}
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breathing">Breathing Break</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">All Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="breathing" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <BreathingBreak />
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <PomodoroStats />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <PomodoroAchievements />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
