"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, CheckCircle2, XCircle, Brain } from "lucide-react"
import Link from "next/link"

const results = {
  score: 85,
  totalQuestions: 15,
  correctAnswers: 13,
  timeSpent: "18 min",
  xpEarned: 125,
  stressLevel: "Low",
  questions: [
    {
      id: 1,
      question: "What is the derivative of x²?",
      userAnswer: "2x",
      correctAnswer: "2x",
      isCorrect: true,
      explanation: "The power rule states that d/dx(xⁿ) = nxⁿ⁻¹. Therefore, d/dx(x²) = 2x¹ = 2x.",
    },
    {
      id: 2,
      question: "What is the integral of 2x?",
      userAnswer: "x²",
      correctAnswer: "x² + C",
      isCorrect: false,
      explanation:
        "When integrating, don't forget the constant of integration C. The correct answer is x² + C, not just x².",
    },
    {
      id: 3,
      question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
      userAnswer: "2",
      correctAnswer: "2",
      isCorrect: true,
      explanation:
        "Factor the numerator: (x² - 1) = (x + 1)(x - 1). Cancel (x - 1) to get (x + 1). As x → 1, the limit is 2.",
    },
  ],
}

export function QuizResults({ quizId }: { quizId: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Results Summary */}
      <Card className="mb-8 border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground">Great job on completing the quiz</p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your Score</span>
            <span className="text-2xl font-bold">{results.score}%</span>
          </div>
          <Progress value={results.score} className="h-3" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border/50 bg-background/50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-chart-3">{results.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Correct Answers</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">+{results.xpEarned}</p>
            <p className="text-xs text-muted-foreground">XP Earned</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold">{results.timeSpent}</p>
            <p className="text-xs text-muted-foreground">Time Spent</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-chart-3">{results.stressLevel}</p>
            <p className="text-xs text-muted-foreground">Avg. Stress</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/dashboard/quiz">Back to Quizzes</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/dashboard/quiz/take/2">
              <TrendingUp className="mr-2 h-4 w-4" />
              Next Quiz
            </Link>
          </Button>
        </div>
      </Card>

      {/* Question Review */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question Review</h2>
        <Badge variant="outline">
          {results.correctAnswers}/{results.totalQuestions} Correct
        </Badge>
      </div>

      <div className="space-y-4">
        {results.questions.map((question, index) => (
          <Card key={question.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline">Question {index + 1}</Badge>
                  {question.isCorrect ? (
                    <Badge variant="default" className="bg-chart-3 text-chart-3-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Incorrect
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-medium leading-relaxed">{question.question}</p>
              </div>
            </div>

            <div className="mb-4 space-y-2 rounded-lg border border-border/50 bg-background/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your answer:</span>
                <span className={question.isCorrect ? "font-medium text-chart-3" : "font-medium text-destructive"}>
                  {question.userAnswer}
                </span>
              </div>
              {!question.isCorrect && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Correct answer:</span>
                  <span className="font-medium text-chart-3">{question.correctAnswer}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Brain className="h-4 w-4 text-primary" />
                <span>Explanation</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
