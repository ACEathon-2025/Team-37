"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, BarChart3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Badge as UIBadge } from "@/components/ui/badge"

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

  // Simple local achievements based on quiz results and recent stress history
  const earned = useMemo(() => {
    const arr: { id: string; title: string; emoji: string; reason: string }[] = []
    if (insights?.score !== undefined) {
      const score = insights.score
      if (score >= 90) arr.push({ id: "quiz-master", title: "Quiz Master", emoji: "🏆", reason: ">= 90%" })
      if (score >= 100) arr.push({ id: "perfect", title: "Perfect Score", emoji: "🌟", reason: "100%" })
    }
    if (insights?.avg_stress !== undefined && insights.avg_stress < 25) {
      arr.push({ id: "calm-learner", title: "Calm Learner", emoji: "🧘", reason: "Low average stress" })
    }
    // Consistency Champ example would normally use real history; here we check a flag in localStorage
    const streak = Number(localStorage.getItem("quizDailyStreak") || 0)
    if (streak >= 7) arr.push({ id: "consistency-champ", title: "Consistency Champ", emoji: "📅", reason: "7-day streak" })
    return arr
  }, [insights])

  const allQuizzes = generatedQuizzes // can merge with static completed quizzes if needed

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {earned.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3 border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <UIBadge variant="outline">Achievements Unlocked</UIBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            {earned.map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <span>{a.emoji}</span>
                <span className="font-medium">{a.title}</span>
                <span className="text-muted-foreground">({a.reason})</span>
              </div>
            ))}
          </div>
        </Card>
      )}
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
