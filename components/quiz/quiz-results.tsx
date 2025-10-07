"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"

export default function QuizResults() {
  const [generatedQuizzes, setGeneratedQuizzes] = useState<any[]>([])
  const [insights, setInsights] = useState<{ score: number; avg_stress: number; feedback: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("generatedQuiz")
    const metaRaw = localStorage.getItem("generatedQuizMeta")
    const resultsRaw = localStorage.getItem("quizResults")
    if (saved) {
      const parsed = JSON.parse(saved)
      const meta = metaRaw ? JSON.parse(metaRaw) : { title: "Generated Quiz", subject: "Generated" }
      const generated = [{
        id: `gen-1`,
        title: meta.title || "Generated Quiz",
        subject: meta.subject || "Generated",
        questions: parsed.length,
        duration: "Varies",
        difficulty: "Adaptive",
        completed: true,
        score: undefined,
      }]
      setGeneratedQuizzes(generated)
    }
    if (resultsRaw) {
      try { setInsights(JSON.parse(resultsRaw)) } catch {}
    }
  }, [])

  const allQuizzes = generatedQuizzes // can merge with static completed quizzes if needed

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {allQuizzes.map((quiz) => (
        <Card key={quiz.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">{quiz.subject}</Badge>
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
          </div>
          <div className="mb-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
              <span>Score: {insights?.score ?? "-"}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{quiz.questions} questions • {quiz.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Difficulty: {quiz.difficulty}</span>
            </div>
            {insights && (
              <div className="mt-2 text-sm">
                <div>Average Stress: {insights.avg_stress}</div>
                <div className="mt-1 whitespace-pre-line">{insights.feedback}</div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
