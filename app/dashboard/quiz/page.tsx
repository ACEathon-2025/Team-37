import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuizLibrary } from "@/components/quiz/quiz-library"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function QuizPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Quiz Center</h1>
            <p className="text-muted-foreground">Generate and take adaptive quizzes</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/quiz/generate">
              <Plus className="mr-2 h-4 w-4" />
              Generate Quiz
            </Link>
          </Button>
        </div>

        <QuizLibrary />
      </main>
    </div>
  )
}
