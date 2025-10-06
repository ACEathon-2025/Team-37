"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const weeklyData = [
  { day: "Mon", score: 75, xp: 120, stress: 3 },
  { day: "Tue", score: 82, xp: 150, stress: 2 },
  { day: "Wed", score: 78, xp: 135, stress: 3 },
  { day: "Thu", score: 88, xp: 180, stress: 2 },
  { day: "Fri", score: 85, xp: 165, stress: 2 },
  { day: "Sat", score: 92, xp: 200, stress: 1 },
  { day: "Sun", score: 80, xp: 140, stress: 2 },
]

const monthlyData = [
  { week: "Week 1", score: 78, xp: 520, stress: 3 },
  { week: "Week 2", score: 82, xp: 680, stress: 2 },
  { week: "Week 3", score: 85, xp: 750, stress: 2 },
  { week: "Week 4", score: 88, xp: 820, stress: 2 },
]

export function PerformanceCharts() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-semibold">Performance Overview</h2>

      <Tabs defaultValue="scores" className="w-full">
        <TabsList>
          <TabsTrigger value="scores">Quiz Scores</TabsTrigger>
          <TabsTrigger value="xp">XP Progress</TabsTrigger>
          <TabsTrigger value="stress">Stress Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Score %" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="xp" className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="xp" fill="hsl(var(--accent))" name="XP Earned" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="stress" className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="stress" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Stress Level" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
