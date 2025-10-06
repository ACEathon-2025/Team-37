"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const subjectData = [
  { subject: "Mathematics", value: 35, color: "hsl(var(--primary))" },
  { subject: "Physics", value: 25, color: "hsl(var(--accent))" },
  { subject: "Chemistry", value: 20, color: "hsl(var(--chart-2))" },
  { subject: "Biology", value: 20, color: "hsl(var(--chart-3))" },
]

const subjectPerformance = [
  { subject: "Mathematics", score: 85, quizzes: 12 },
  { subject: "Physics", score: 78, quizzes: 8 },
  { subject: "Chemistry", score: 92, quizzes: 7 },
  { subject: "Biology", score: 88, quizzes: 7 },
]

export function SubjectBreakdown() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-semibold">Subject Breakdown</h2>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={subjectData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {subjectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Performance by Subject</p>
        {subjectPerformance.map((subject) => (
          <div key={subject.subject}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{subject.subject}</span>
              <span className="text-muted-foreground">
                {subject.score}% • {subject.quizzes} quizzes
              </span>
            </div>
            <Progress value={subject.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
