import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AITutorChat } from "@/components/tutor/ai-tutor-chat"

export default function TutorPage() {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <AITutorChat />
    </div>
  )
}
