"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Camera, Heart, AlertCircle } from "lucide-react"
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
	const [stressLevel, setStressLevel] = useState("low")
  const [wrongStreak, setWrongStreak] = useState(0)
  const [questionPool, setQuestionPool] = useState<GeneratedQuestion[]>([])
  const [displayedQuestions, setDisplayedQuestions] = useState<GeneratedQuestion[]>([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"
  const [answers, setAnswers] = useState<{ isCorrect: boolean }[]>([])
  const [stressHistory, setStressHistory] = useState<number[]>([])

	const progress = useMemo(() => {
    const total = Math.max(displayedQuestions.length, 1)
    return ((currentQuestion + 1) / total) * 100
  }, [currentQuestion, displayedQuestions.length])

  useEffect(() => {
    // Load generated quiz from storage if available
    const saved = typeof window !== "undefined" ? localStorage.getItem("generatedQuiz") : null
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved)
        // Normalize to our structure
        const normalized: GeneratedQuestion[] = parsed.map((q, idx) => ({
          question: q.question || `Question ${idx + 1}`,
          options: q.options || [],
          correct_answer: q.correct_answer,
        }))
        setQuestionPool(normalized)
        setDisplayedQuestions(normalized)
        if (!normalized.length) {
          alert("No questions were generated. Please try another file or smaller document.")
          router.push("/dashboard/quiz/generate")
        }
        return
      } catch {}
    }
    // Fallback to a tiny default if nothing generated
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
		const newStreak = !isCorrect ? wrongStreak + 1 : 0
		setWrongStreak(newStreak)
    setAnswers((prev) => [...prev, { isCorrect }])
    // basic stress proxy from wrong streak
    setStressHistory((prev) => [...prev, Math.min(10, 3 + newStreak)])

		// silent adaptive logic: if struggling, pick an earlier question with overlapping options as an easier step
    if (newStreak >= 3 && questionPool.length > 0) {
      // Heuristic: move next to a question with the most options overlap with the current question's options
      const currentOptions = new Set((current.options || []).map((o) => o.toLowerCase()))
      let bestIdx = currentQuestion + 1
      let bestScore = -1
      for (let i = 0; i < displayedQuestions.length; i++) {
        if (i <= currentQuestion) continue
        const opts = new Set((displayedQuestions[i].options || []).map((o) => o.toLowerCase()))
        let overlap = 0
        currentOptions.forEach((o) => { if (opts.has(o)) overlap++ })
        if (overlap > bestScore) { bestScore = overlap; bestIdx = i }
      }
      // If we found a candidate, we will jump to it; otherwise just continue
      setWrongStreak(0)
      if (bestIdx > currentQuestion && bestIdx < displayedQuestions.length) {
        setCurrentQuestion(bestIdx)
        setSelectedAnswer(null)
        return
      }
    }

		if (currentQuestion < displayedQuestions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
			setSelectedAnswer(null)
		} else {
      // submit to backend for insights
      try {
        const res = await fetch(`${backendUrl}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, stress: stressHistory })
        })
        const data = await res.json()
        if (res.ok) {
          localStorage.setItem("quizResults", JSON.stringify(data))
        }
      } catch {}
			router.push(`/dashboard/quiz/results/${quizId}`)
		}
	}

	return (
		<div className="mx-auto max-w-4xl">
			{/* Stress Detection Banner */}
			<Card className="mb-6 border-chart-3/50 bg-chart-3/10 p-4 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
							<Camera className="h-5 w-5 text-chart-3" />
						</div>
						<div>
							<p className="text-sm font-medium">Stress Detection Active</p>
							<p className="text-xs text-muted-foreground">
								Current level: {stressLevel}
							</p>
						</div>
					</div>
					<Badge
						variant="outline"
						className="border-chart-3 text-chart-3"
					>
						<Heart className="mr-1 h-3 w-3" />
						Monitoring
					</Badge>
				</div>
			</Card>

			{/* Quiz Progress */}
			<div className="mb-6">
				<div className="mb-2 flex items-center justify-between text-sm">
					<span className="text-muted-foreground">
            Question {currentQuestion + 1} of {Math.max(displayedQuestions.length, 1)}
					</span>
					<span className="font-medium">
						{Math.round(progress)}% Complete
					</span>
				</div>
				<Progress value={progress} className="h-2" />
			</div>

			{/* Question Card */}
			<Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
				<div className="mb-6">
            <Badge variant="outline" className="mb-4">
            Generated
            </Badge>
						<h2 className="text-2xl font-semibold leading-relaxed">
            {displayedQuestions[currentQuestion]?.question || "Question"}
						</h2>
				</div>

            <RadioGroup
						value={selectedAnswer?.toString()}
						onValueChange={(value) =>
							setSelectedAnswer(Number(value))
						}
					>
					<div className="space-y-3">
                {(displayedQuestions[currentQuestion]?.options || []).length > 0 ? (
                  (displayedQuestions[currentQuestion]?.options || []).map((option, index) => (
							<div
								key={index}
								className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-colors ${
									selectedAnswer === index
										? "border-primary bg-primary/5"
										: "border-border/50 hover:border-border hover:bg-background/50"
								}`}
							>
								<RadioGroupItem
									value={index.toString()}
									id={`option-${index}`}
								/>
								<Label
									htmlFor={`option-${index}`}
									className="flex-1 cursor-pointer text-base"
								>
									{option}
								</Label>
							</div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No options available</div>
                )}
					</div>
				</RadioGroup>

				{stressLevel === "high" && (
					<div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
							<div>
								<p className="mb-1 text-sm font-medium">
									High stress detected
								</p>
								<p className="text-xs text-muted-foreground">
									Take a deep breath. Would you like to take a short
									break or get a hint?
								</p>
								<div className="mt-3 flex gap-2">
									<Button size="sm" variant="outline">
										Take Break
									</Button>
									<Button size="sm" variant="outline">
										Get Hint
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 flex gap-3">
					<Button
						variant="outline"
						className="flex-1 bg-transparent"
						disabled={currentQuestion === 0}
					>
						Previous
					</Button>
              <Button
						className="flex-1"
						onClick={handleNext}
                disabled={selectedAnswer === null || (displayedQuestions[currentQuestion]?.options || []).length === 0}
					>
						{currentQuestion === Math.max(displayedQuestions.length - 1, 0)
							? "Finish Quiz"
							: "Next Question"}
					</Button>
				</div>
			</Card>
		</div>
	)
}
