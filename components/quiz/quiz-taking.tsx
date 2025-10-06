"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Camera, Heart, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    question: "What is the derivative of x²?",
    options: ["x", "2x", "x²", "2x²"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What is the integral of 2x?",
    options: ["x", "x²", "2x²", "x² + C"],
    correctAnswer: 3,
  },
  {
    id: 3,
    question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
    options: ["0", "1", "2", "undefined"],
    correctAnswer: 2,
  },
]

export function QuizTaking({ quizId }: { quizId: string }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [stressLevel, setStressLevel] = useState("low")

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
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
              <p className="text-xs text-muted-foreground">Current level: {stressLevel}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-chart-3 text-chart-3">
            <Heart className="mr-1 h-3 w-3" />
            Monitoring
          </Badge>
        </div>
      </Card>

      {/* Quiz Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="mb-6">
          <Badge variant="outline" className="mb-4">
            Mathematics
          </Badge>
          <h2 className="text-2xl font-semibold leading-relaxed">{questions[currentQuestion].question}</h2>
        </div>

        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(Number(value))}>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-colors ${
                  selectedAnswer === index
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-border hover:bg-background/50"
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {stressLevel === "high" && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="mb-1 text-sm font-medium">High stress detected</p>
                <p className="text-xs text-muted-foreground">
                  Take a deep breath. Would you like to take a short break or get a hint?
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
          <Button variant="outline" className="flex-1 bg-transparent" disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button className="flex-1" onClick={handleNext} disabled={selectedAnswer === null}>
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
