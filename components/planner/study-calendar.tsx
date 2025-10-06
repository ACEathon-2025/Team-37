"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { CreateSessionDialog } from "./create-session-dialog"

const sessions = [
  {
    id: "1",
    title: "Mathematics Study",
    subject: "Mathematics",
    topic: "Linear Algebra",
    date: "2024-01-15",
    time: "15:00",
    duration: 60,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Physics Review",
    subject: "Physics",
    topic: "Quantum Mechanics",
    date: "2024-01-16",
    time: "10:00",
    duration: 45,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Chemistry Lab Prep",
    subject: "Chemistry",
    topic: "Thermodynamics",
    date: "2024-01-17",
    time: "14:00",
    duration: 50,
    status: "upcoming",
  },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function StudyCalendar() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar View */}
      <div className="lg:col-span-2">
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2
              const hasSession = day === 15 || day === 16 || day === 17
              const isToday = day === 14

              return (
                <button
                  key={i}
                  className={`aspect-square rounded-lg border p-2 text-sm transition-colors ${
                    day < 1
                      ? "border-transparent text-muted-foreground/50"
                      : isToday
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : hasSession
                          ? "border-accent bg-accent/10 font-medium hover:bg-accent/20"
                          : "border-border/50 hover:border-border hover:bg-background/50"
                  }`}
                >
                  {day > 0 && day}
                  {hasSession && <div className="mt-1 h-1 w-1 rounded-full bg-accent mx-auto" />}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-1 font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.topic}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {session.subject}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {session.time} ({session.duration}m)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <CreateSessionDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
