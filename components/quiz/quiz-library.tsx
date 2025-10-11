"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuizLibrary() {
  const [generatedQuizzes, setGeneratedQuizzes] = useState<any[]>([])

  // ---- Dummy quiz metadata ----
  const getDummyQuiz = () => {
    const savedMeta = localStorage.getItem("generatedQuizMeta")
    const savedQuestions = localStorage.getItem("generatedQuiz")

    const meta = savedMeta
      ? JSON.parse(savedMeta)
      : { title: "Dummy Quiz", subject: "Biology", topics: "Anatomy" }

    const questions = savedQuestions
      ? JSON.parse(savedQuestions)
      : [
          { question: "What is the largest organ in the human body?", options: ["Skin","Liver","Heart","Lungs"], correct_answer: "Skin" },
          { question: "Number of bones in adult human body?", options: ["206","201","210","198"], correct_answer: "206" },
          { question: "Which organ pumps blood?", options: ["Liver","Heart","Kidney","Lungs"], correct_answer: "Heart" },
        ]

    return [
      {
        id: "gen-1",
        title: meta.title || "Dummy Quiz",
        subject: meta.subject || "Biology",
        questions: questions.length,
        duration: "Varies",
        difficulty: "Adaptive",
        completed: false,
        score: null,
      },
    ]
  }

  useEffect(() => {
    const saved = localStorage.getItem("generatedQuiz")
    if (saved && saved !== "undefined" && saved !== "") {
      try {
        const parsed = JSON.parse(saved)
        const metaRaw = localStorage.getItem("generatedQuizMeta")
        const meta = metaRaw ? JSON.parse(metaRaw) : { title: "Generated Quiz", subject: "Generated" }
        const generated = [
          {
            id: "gen-1",
            title: meta.title || "Generated Quiz",
            subject: meta.subject || "Generated",
            questions: parsed.length,
            duration: "Varies",
            difficulty: "Adaptive",
            completed: false,
            score: null,
          },
        ]
        setGeneratedQuizzes(generated)
      } catch (e) {
        localStorage.removeItem("generatedQuiz")
        setGeneratedQuizzes(getDummyQuiz())
      }
    } else {
      // No saved quizzes, use dummy
      setGeneratedQuizzes(getDummyQuiz())
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
            <div>Questions: {quiz.questions}</div>
            <div>Difficulty: {quiz.difficulty}</div>
            <div>Duration: {quiz.duration}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
