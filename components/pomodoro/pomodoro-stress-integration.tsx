"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import SimpleStressDetector from "../tutor/SimpleStressDetector"

interface StressData {
  score: number
  timestamp: number
  session: "pomodoro" | "break" | "idle"
}

interface PomodoroStressIntegrationProps {
  currentMode: "pomodoro" | "shortBreak" | "longBreak"
  isRunning: boolean
  selectedTask: any
}

export function PomodoroStressIntegration({ currentMode, isRunning, selectedTask }: PomodoroStressIntegrationProps) {
  const [stressHistory, setStressHistory] = useState<StressData[]>([])
  const [currentStress, setCurrentStress] = useState<number>(0)
  const [stressLevel, setStressLevel] = useState<"low" | "medium" | "high">("low")
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [showBreathingSuggestion, setShowBreathingSuggestion] = useState(false)

  // Analyze stress patterns and provide recommendations
  useEffect(() => {
    if (stressHistory.length < 3) return

    const recentStress = stressHistory.slice(-5).map(s => s.score)
    const avgStress = recentStress.reduce((sum, score) => sum + score, 0) / recentStress.length
    const stressTrend = recentStress[recentStress.length - 1] - recentStress[0]

    let level: "low" | "medium" | "high" = "low"
    if (avgStress > 30 && avgStress <= 60) level = "medium"
    else if (avgStress > 60) level = "high"

    setStressLevel(level)

    // Generate recommendations based on stress patterns
    const newRecommendations: string[] = []
    
    if (level === "high") {
      newRecommendations.push("Consider taking a longer break")
      newRecommendations.push("Try the breathing exercises")
      newRecommendations.push("Switch to an easier task")
      if (currentMode === "pomodoro") {
        setShowBreathingSuggestion(true)
      }
    } else if (level === "medium") {
      newRecommendations.push("Take a short breathing break")
      newRecommendations.push("Check your posture")
      newRecommendations.push("Ensure good lighting")
    } else {
      newRecommendations.push("Great focus level! Keep it up")
      newRecommendations.push("You're in the zone")
    }

    if (stressTrend > 10) {
      newRecommendations.push("Stress levels are rising - take a break soon")
    } else if (stressTrend < -10) {
      newRecommendations.push("Stress levels improving - good job!")
    }

    setRecommendations(newRecommendations)
  }, [stressHistory, currentMode])

  const handleStressDetected = (score: number) => {
    const newStressData: StressData = {
      score,
      timestamp: Date.now(),
      session: currentMode === "pomodoro" ? "pomodoro" : currentMode === "shortBreak" || currentMode === "longBreak" ? "break" : "idle"
    }

    setCurrentStress(score)
    setStressHistory(prev => [...prev.slice(-19), newStressData]) // Keep last 20 readings

    // Log to backend for analytics
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"
      fetch(`${backendUrl}/emotion-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stress_score: score,
          timestamp: new Date().toISOString(),
          session_type: currentMode,
          task_category: selectedTask?.category || "none"
        }),
      })
    } catch (error) {
      console.error("Failed to log stress data:", error)
    }
  }

  const getStressColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400"
      case "high": return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getStressIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="h-4 w-4" />
      case "medium": return <TrendingUp className="h-4 w-4" />
      case "high": return <AlertTriangle className="h-4 w-4" />
      default: return <Heart className="h-4 w-4" />
    }
  }

  const getSessionStressAvg = () => {
    const sessionStress = stressHistory.filter(s => s.session === currentMode)
    if (sessionStress.length === 0) return 0
    return sessionStress.reduce((sum, s) => sum + s.score, 0) / sessionStress.length
  }

  const dismissBreathingSuggestion = () => {
    setShowBreathingSuggestion(false)
  }

  return (
    <>
      <SimpleStressDetector 
        onStressDetected={handleStressDetected} 
        intervalMs={3000}
        hidden={false}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Stress Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Stress Level */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{Math.round(currentStress)}</span>
              <Badge className={getStressColor(stressLevel)}>
                {getStressIcon(stressLevel)}
                <span className="ml-1 capitalize">{stressLevel}</span>
              </Badge>
            </div>
            <Progress 
              value={currentStress} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, 
                  #10b981 0%, 
                  #f59e0b 50%, 
                  #ef4444 100%)`
              }}
            />
            <div className="text-sm text-muted-foreground">
              Current stress level
            </div>
          </div>

          {/* Session Average */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {currentMode === "pomodoro" ? "Focus Session" : "Break"} Average
            </div>
            <div className="text-lg font-medium">
              {Math.round(getSessionStressAvg())}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recommendations</h4>
              <div className="space-y-1">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stress Trend */}
          {stressHistory.length >= 2 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Trend</h4>
              <div className="flex items-center gap-2">
                {stressHistory.slice(-5).map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 h-8 rounded-sm"
                    style={{
                      backgroundColor: data.score > 60 ? "#ef4444" : 
                                     data.score > 30 ? "#f59e0b" : "#10b981",
                      opacity: 0.7
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Last 5 readings
              </div>
            </div>
          )}

          {/* Breathing Break Suggestion */}
          {showBreathingSuggestion && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="flex items-center justify-between">
                  <span>High stress detected. Try a breathing break?</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={dismissBreathingSuggestion}
                  >
                    Maybe later
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  )
}
