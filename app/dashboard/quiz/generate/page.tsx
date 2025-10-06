import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuizGenerationForm } from "@/components/quiz/quiz-generation-form"

export default function GenerateQuizPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Generate Quiz</h1>
          <p className="text-muted-foreground">Upload materials or select topics to create a personalized quiz</p>
        </div>

        <QuizGenerationForm />
      </main>
    </div>
  )
}
