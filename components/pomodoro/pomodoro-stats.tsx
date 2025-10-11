"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Calendar, Clock, Target, TrendingUp, Award, Flame } from "lucide-react"

interface PomodoroSession {
  id: string
  date: string
  taskId: string
  taskTitle: string
  category: "Work" | "Study" | "Personal"
  duration: number
  completed: boolean
}

interface DailyStats {
  date: string
  pomodoros: number
  totalTime: number
  categories: {
    Work: number
    Study: number
    Personal: number
  }
}

interface WeeklyStats {
  week: string
  pomodoros: number
  totalTime: number
  averagePerDay: number
}

export function PomodoroStats() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalPomodoros, setTotalPomodoros] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("pomodoro-sessions")
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions)
      setSessions(parsedSessions)
      calculateStats(parsedSessions)
    }
  }, [])

  // Listen for new pomodoro completions
  useEffect(() => {
    const handlePomodoroComplete = (event: CustomEvent) => {
      const { taskId, taskTitle, category } = event.detail
      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        taskId,
        taskTitle,
        category,
        duration: 25, // Default pomodoro duration
        completed: true
      }
      
      const updatedSessions = [...sessions, newSession]
      setSessions(updatedSessions)
      localStorage.setItem("pomodoro-sessions", JSON.stringify(updatedSessions))
      calculateStats(updatedSessions)
    }

    window.addEventListener("pomodoroComplete", handlePomodoroComplete as EventListener)
    return () => window.removeEventListener("pomodoroComplete", handlePomodoroComplete as EventListener)
  }, [sessions])

  const calculateStats = (sessions: PomodoroSession[]) => {
    // Calculate daily stats for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const daily = last7Days.map(date => {
      const daySessions = sessions.filter(s => s.date === date)
      const pomodoros = daySessions.length
      const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0)
      const categories = daySessions.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1
        return acc
      }, { Work: 0, Study: 0, Personal: 0 })

      return { date, pomodoros, totalTime, categories }
    })

    setDailyStats(daily)

    // Calculate weekly stats for the last 4 weeks
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (i + 1) * 7)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() - i * 7)
      
      const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date)
        return sessionDate >= startDate && sessionDate < endDate
      })

      return {
        week: `Week ${4 - i}`,
        pomodoros: weekSessions.length,
        totalTime: weekSessions.reduce((sum, s) => sum + s.duration, 0),
        averagePerDay: Math.round(weekSessions.length / 7 * 10) / 10
      }
    }).reverse()

    setWeeklyStats(last4Weeks)

    // Calculate streaks
    let currentStreakCount = 0
    let longestStreakCount = 0
    let tempStreak = 0

    // Check consecutive days with pomodoros
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const daySessions = sessions.filter(s => s.date === dateStr)

      if (daySessions.length > 0) {
        if (i === 0 || tempStreak > 0) {
          tempStreak++
          if (i === 0) currentStreakCount = tempStreak
        }
        longestStreakCount = Math.max(longestStreakCount, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    setCurrentStreak(currentStreakCount)
    setLongestStreak(longestStreakCount)

    // Calculate totals
    setTotalPomodoros(sessions.length)
    setTotalTime(sessions.reduce((sum, s) => sum + s.duration, 0))
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work": return "#3b82f6"
      case "Study": return "#10b981"
      case "Personal": return "#8b5cf6"
      default: return "#6b7280"
    }
  }

  // Prepare data for charts
  const categoryData = [
    { name: "Work", value: sessions.filter(s => s.category === "Work").length, color: getCategoryColor("Work") },
    { name: "Study", value: sessions.filter(s => s.category === "Study").length, color: getCategoryColor("Study") },
    { name: "Personal", value: sessions.filter(s => s.category === "Personal").length, color: getCategoryColor("Personal") }
  ].filter(item => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalPomodoros}</div>
                <div className="text-sm text-muted-foreground">Total Pomodoros</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{formatTime(totalTime)}</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                  <Flame className="h-5 w-5" />
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                  <Award className="h-5 w-5" />
                  {longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </div>

            {/* Category Distribution */}
            {categoryData.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Focus Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [value, name === 'pomodoros' ? 'Pomodoros' : 'Minutes']}
                  />
                  <Bar dataKey="pomodoros" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {dailyStats.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {day.pomodoros} pomodoros • {formatTime(day.totalTime)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {day.categories.Work > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Work: {day.categories.Work}
                      </Badge>
                    )}
                    {day.categories.Study > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Study: {day.categories.Study}
                      </Badge>
                    )}
                    {day.categories.Personal > 0 && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        Personal: {day.categories.Personal}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === 'pomodoros' ? 'Pomodoros' : 'Average per day']} />
                  <Line type="monotone" dataKey="pomodoros" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="averagePerDay" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {weeklyStats.map((week) => (
                <div key={week.week} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{week.week}</div>
                    <div className="text-sm text-muted-foreground">
                      {week.pomodoros} pomodoros • {formatTime(week.totalTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{week.averagePerDay}</div>
                    <div className="text-sm text-muted-foreground">avg/day</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
