import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuizTaking } from "@/components/quiz/quiz-taking"

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <QuizTaking quizId={params.id} />
      </main>
    </div>
  )
}
