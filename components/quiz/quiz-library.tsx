"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuizLibrary() {
  const [generatedQuizzes, setGeneratedQuizzes] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("generatedQuiz")
    // Only parse if saved is not null, not "undefined", and not empty
    if (saved && saved !== "undefined" && saved !== "") {
      try {
        const parsed = JSON.parse(saved)
        const generated = [{
          id: "gen-1",
          title: "Generated Quiz",
          subject: "Generated",
          questions: parsed.length,
          duration: "Varies",
          difficulty: "Adaptive",
          completed: false,
          score: null,
        }]
        setGeneratedQuizzes(generated)
      } catch (e) {
        // If parsing fails, clear the invalid value
        localStorage.removeItem("generatedQuiz")
        setGeneratedQuizzes([])
      }
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {generatedQuizzes.map((quiz) => (
        <Card key={quiz.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">{quiz.subject}</Badge>
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
          </div>
          <div className="mb-4 space-y-2 text-sm text-muted-foreground">
            <div>
              <span>Questions: {quiz.questions}</span>
            </div>
            <div>
              <span>Difficulty: {quiz.difficulty}</span>
            </div>
            <div>
              <span>Duration: {quiz.duration}</span>
            </div>
          </div>
        </Card>
      ))}
      {generatedQuizzes.length === 0 && (
        <p>No AI-generated quizzes found. Upload a file to generate a quiz!</p>
      )}
    </div>
  )
}
