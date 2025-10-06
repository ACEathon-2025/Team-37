import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuizResults } from "@/components/quiz/quiz-results"

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <QuizResults quizId={params.id} />
      </main>
    </div>
  )
}
