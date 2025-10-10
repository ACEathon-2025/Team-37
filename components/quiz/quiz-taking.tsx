"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

type GeneratedQuestion = {
  question: string
  options: string[]
  correct_answer?: string
  correctAnswer?: number
}

export function QuizTaking({ quizId }: { quizId: string }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questionPool, setQuestionPool] = useState<GeneratedQuestion[]>([])
  const [displayedQuestions, setDisplayedQuestions] = useState<GeneratedQuestion[]>([])
  const [answers, setAnswers] = useState<{ isCorrect: boolean }[]>([])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"

  const progress = useMemo(() => {
    const total = Math.max(displayedQuestions.length, 1)
    return ((currentQuestion + 1) / total) * 100
  }, [currentQuestion, displayedQuestions.length])

  useEffect(() => {
    // Load generated quiz from storage if available
    const saved = typeof window !== "undefined" ? localStorage.getItem("generatedQuiz") : null
    if (saved) {
      try {
        const parsed: GeneratedQuestion[] = JSON.parse(saved)
        setQuestionPool(parsed)
        setDisplayedQuestions(parsed)
        if (!parsed.length) router.push("/dashboard/quiz/generate")
        return
      } catch {}
    }

    // Fallback questions
    const fallback: GeneratedQuestion[] = [
      { question: "Placeholder question 1", options: ["A", "B", "C", "D"], correct_answer: "A" },
      { question: "Placeholder question 2", options: ["A", "B", "C", "D"], correct_answer: "B" },
      { question: "Placeholder question 3", options: ["A", "B", "C", "D"], correct_answer: "C" },
    ]
    setQuestionPool(fallback)
    setDisplayedQuestions(fallback)
  }, [])

  const handleNext = async () => {
    const current = displayedQuestions[currentQuestion]
    const correctIndex = (() => {
      if (typeof current.correctAnswer === "number") return current.correctAnswer
      if (current.correct_answer && current.options) {
        const idx = current.options.findIndex(
          (opt) => opt.trim().toLowerCase() === current.correct_answer!.trim().toLowerCase()
        )
        return idx >= 0 ? idx : -1
      }
      return -1
    })()

    const isCorrect = selectedAnswer !== null && selectedAnswer === correctIndex
    setAnswers((prev) => [...prev, { isCorrect }])

    if (currentQuestion < displayedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      // Submit results to backend
      try {
        const res = await fetch(`${backendUrl}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers })
        })
        const data = await res.json()
        if (res.ok) localStorage.setItem("quizResults", JSON.stringify(data))
      } catch {}
      router.push(`/dashboard/quiz/results/${quizId}`)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {Math.max(displayedQuestions.length, 1)}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="mb-6">
          <Badge variant="outline" className="mb-4">Generated</Badge>
          <h2 className="text-2xl font-semibold leading-relaxed">
            {displayedQuestions[currentQuestion]?.question || "Question"}
          </h2>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
          onValueChange={(val) => setSelectedAnswer(Number(val))}
        >
          {displayedQuestions[currentQuestion]?.options.map((option, index) => (
            <RadioGroupItem key={index} value={index.toString()}>
              {option}
            </RadioGroupItem>
          ))}
        </RadioGroup>

        {/* Next button */}
        <div className="mt-6">
          <Button onClick={handleNext} disabled={selectedAnswer === null}>
            {currentQuestion < displayedQuestions.length - 1 ? "Next" : "Submit"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
