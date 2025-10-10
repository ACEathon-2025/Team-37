"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, Badge, Button } from "@/components/ui" // Make sure your index.ts exports Card and Badge
import { Clock, CheckCircle2, BarChart3 } from "lucide-react"

type GeneratedQuiz = {
  id: string
  title: string
  subject: string
  questions: number
  duration: string
  difficulty: string
  completed: boolean
  score?: number
}

type QuizInsights = {
  score: number
  feedback: string
}

export default function QuizResultsPage() {
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([])
  const [insights, setInsights] = useState<QuizInsights | null>(null)

  useEffect(() => {
    const savedQuiz = localStorage.getItem("generatedQuiz")
    const savedMeta = localStorage.getItem("generatedQuizMeta")
    const savedResults = localStorage.getItem("quizResults")

    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz)
      const meta = savedMeta ? JSON.parse(savedMeta) : { title: "Generated Quiz", subject: "Generated" }
      setQuizzes([{
        id: "gen-1",
        title: meta.title || "Generated Quiz",
        subject: meta.subject || "Generated",
        questions: parsed.length,
        duration: "Varies",
        difficulty: "Adaptive",
        completed: true,
      }])
    }

    if (savedResults) {
      try {
        const resultData = JSON.parse(savedResults)
        const score = resultData.score ?? 0
        let feedback = ""
        if (score >= 90) feedback = "Excellent! Keep practicing to maintain your performance."
        else if (score >= 70) feedback = "Good job! Review weaker topics to improve further."
        else if (score >= 50) feedback = "Fair attempt. Focus on understanding core concepts."
        else feedback = "Needs improvement. Revisit the study material and try again."
        setInsights({ score, feedback })
      } catch {}
    }
  }, [])

  const achievements = useMemo(() => {
    const arr: { id: string; title: string; emoji: string; reason: string }[] = []
    if (insights?.score !== undefined) {
      const score = insights.score
      if (score >= 90) arr.push({ id: "quiz-master", title: "Quiz Master", emoji: "🏆", reason: ">= 90%" })
      if (score === 100) arr.push({ id: "perfect-score", title: "Perfect Score", emoji: "🌟", reason: "100%" })
    }
    const streak = Number(localStorage.getItem("quizDailyStreak") || 0)
    if (streak >= 7) arr.push({ id: "consistency-champ", title: "Consistency Champ", emoji: "📅", reason: "7-day streak" })
    return arr
  }, [insights])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {achievements.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3 border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h3 className="mb-3 font-semibold">Achievements Unlocked</h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map(a => (
              <div key={a.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <span>{a.emoji}</span>
                <span className="font-medium">{a.title}</span>
                <span className="text-muted-foreground">({a.reason})</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {quizzes.map(quiz => (
        <Card key={quiz.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">{quiz.subject}</Badge>
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
          </div>
          <div className="mb-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Score: {insights?.score ?? "-" }%</span>
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
                <div className="font-medium">Improvement Tips:</div>
                <p>{insights.feedback}</p>
              </div>
            )}
          </div>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </Card>
      ))}

      {quizzes.length === 0 && (
        <p>No quiz results found. Please take a quiz first.</p>
      )}
    </div>
  )
}
