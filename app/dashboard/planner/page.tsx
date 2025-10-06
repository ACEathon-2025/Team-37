import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StudyCalendar } from "@/components/planner/study-calendar"
import { NotesList } from "@/components/planner/notes-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlannerPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Study Planner</h1>
          <p className="text-muted-foreground">Organize your study sessions and notes</p>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <StudyCalendar />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <NotesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
