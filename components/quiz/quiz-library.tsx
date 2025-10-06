"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle2, Play, BarChart3 } from "lucide-react"
import Link from "next/link"

const quizzes = [
  {
    id: "1",
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    questions: 15,
    duration: "20 min",
    difficulty: "Medium",
    completed: true,
    score: 85,
  },
  {
    id: "2",
    title: "Organic Chemistry Basics",
    subject: "Chemistry",
    questions: 20,
    duration: "25 min",
    difficulty: "Hard",
    completed: true,
    score: 92,
  },
  {
    id: "3",
    title: "Quantum Mechanics",
    subject: "Physics",
    questions: 12,
    duration: "15 min",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: "4",
    title: "Linear Algebra",
    subject: "Mathematics",
    questions: 18,
    duration: "22 min",
    difficulty: "Medium",
    completed: false,
  },
]

export function QuizLibrary() {
  const availableQuizzes = quizzes.filter((q) => !q.completed)
  const completedQuizzes = quizzes.filter((q) => q.completed)

  return (
    <Tabs defaultValue="available" className="w-full">
      <TabsList>
        <TabsTrigger value="available">Available ({availableQuizzes.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedQuizzes.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {quiz.subject}
                </Badge>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
              </div>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {quiz.questions} questions • {quiz.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Difficulty: {quiz.difficulty}</span>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/dashboard/quiz/take/${quiz.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Quiz
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {quiz.subject}
                </Badge>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
              </div>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-chart-3" />
                  <span>Score: {quiz.score}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {quiz.questions} questions • {quiz.duration}
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/dashboard/quiz/results/${quiz.id}`}>View Results</Link>
              </Button>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
