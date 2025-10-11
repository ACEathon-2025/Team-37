"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Task, TaskManager } from "./task-manager"
import { PomodoroSettings } from "./pomodoro-settings"
import { PomodoroStressIntegration } from "./pomodoro-stress-integration"

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak"
export type TimerState = "idle" | "running" | "paused"

export interface PomodoroSettings {
  pomodoroDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  longBreakInterval: number // after how many pomodoros
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
}

const defaultSettings: PomodoroSettings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  autoStartBreaks: true,
  autoStartPomodoros: false
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [state, setState] = useState<TimerState>("idle")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // in seconds
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [soundPlaying, setSoundPlaying] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoro-settings")
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings))
  }, [settings])

  // Initialize timer duration based on current mode and settings
  useEffect(() => {
    const duration = getDurationForMode(mode, settings)
    setTimeLeft(duration * 60)
  }, [mode, settings])

  // Timer logic
  useEffect(() => {
    if (state === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, timeLeft])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && state === "running") {
      handleTimerComplete()
    }
  }, [timeLeft, state])

  const getDurationForMode = (mode: TimerMode, settings: PomodoroSettings): number => {
    switch (mode) {
      case "pomodoro": return settings.pomodoroDuration
      case "shortBreak": return settings.shortBreakDuration
      case "longBreak": return settings.longBreakDuration
      default: return 25
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    const duration = getDurationForMode(mode, settings)
    const totalSeconds = duration * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  const playNotificationSound = useCallback(() => {
    if (settings.soundEnabled && !soundPlaying) {
      setSoundPlaying(true)
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      setTimeout(() => setSoundPlaying(false), 500)
    }
  }, [settings.soundEnabled, soundPlaying])

  const showNotification = useCallback((title: string, body: string) => {
    if (settings.notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body, icon: "/favicon.ico" })
          }
        })
      }
    }
  }, [settings.notificationsEnabled])

  const handleTimerComplete = useCallback(() => {
    setState("idle")
    playNotificationSound()
    
    if (mode === "pomodoro") {
      const newPomodoroCount = pomodoroCount + 1
      setPomodoroCount(newPomodoroCount)
      
      // Increment pomodoro count for selected task
      if (selectedTask) {
        const event = new CustomEvent("incrementPomodoros", { detail: selectedTask.id })
        window.dispatchEvent(event)
      }
      
      toast({
        title: "Pomodoro Complete! 🎉",
        description: "Time for a break! Great work!",
        duration: 5000
      })
      
      showNotification("Pomodoro Complete!", "Time for a break! Great work!")
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        const shouldTakeLongBreak = newPomodoroCount % settings.longBreakInterval === 0
        const nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak"
        setMode(nextMode)
        const duration = getDurationForMode(nextMode, settings)
        setTimeLeft(duration * 60)
        setState("running")
      }
    } else {
      // Break completed
      toast({
        title: "Break Complete! ⏰",
        description: "Ready to focus again?",
        duration: 5000
      })
      
      showNotification("Break Complete!", "Ready to focus again?")
      
      // Auto-start next pomodoro if enabled
      if (settings.autoStartPomodoros) {
        setMode("pomodoro")
        const duration = getDurationForMode("pomodoro", settings)
        setTimeLeft(duration * 60)
        setState("running")
      }
    }
  }, [mode, pomodoroCount, selectedTask, settings, toast, showNotification, playNotificationSound])

  const startTimer = () => {
    setState("running")
  }

  const pauseTimer = () => {
    setState("paused")
  }

  const resetTimer = () => {
    setState("idle")
    const duration = getDurationForMode(mode, settings)
    setTimeLeft(duration * 60)
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setState("idle")
    const duration = getDurationForMode(newMode, settings)
    setTimeLeft(duration * 60)
  }

  const getModeColor = (): string => {
    switch (mode) {
      case "pomodoro": return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
      case "shortBreak": return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
      case "longBreak": return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getModeLabel = (): string => {
    switch (mode) {
      case "pomodoro": return "Focus Time"
      case "shortBreak": return "Short Break"
      case "longBreak": return "Long Break"
      default: return "Focus Time"
    }
  }

  // Listen for task selection events
  useEffect(() => {
    const handleTaskSelect = (event: CustomEvent) => {
      const taskId = event.detail
      // This would be handled by parent component or context
    }

    window.addEventListener("taskSelected", handleTaskSelect as EventListener)
    return () => window.removeEventListener("taskSelected", handleTaskSelect as EventListener)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              🍅
            </div>
            Pomodoro Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            >
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2">
          <Button
            variant={mode === "pomodoro" ? "default" : "outline"}
            onClick={() => switchMode("pomodoro")}
            className="flex-1"
          >
            Focus
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "outline"}
            onClick={() => switchMode("shortBreak")}
            className="flex-1"
          >
            Short Break
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "outline"}
            onClick={() => switchMode("longBreak")}
            className="flex-1"
          >
            Long Break
          </Button>
        </div>

        {/* Current Task Display */}
        {selectedTask && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Task</p>
            <div className="flex items-center justify-center gap-2">
              <Badge className={getModeColor()}>
                {selectedTask.category}
              </Badge>
              <span className="font-medium">{selectedTask.title}</span>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-mono font-bold mb-2">
              {formatTime(timeLeft)}
            </div>
            <Badge className={`${getModeColor()} text-sm`}>
              {getModeLabel()}
            </Badge>
          </div>
          
          <Progress value={getProgress()} className="h-2" />
          
          <div className="text-sm text-muted-foreground">
            Pomodoros completed today: {pomodoroCount}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {state === "idle" ? (
            <Button onClick={startTimer} size="lg" className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : state === "running" ? (
            <Button onClick={pauseTimer} variant="outline" size="lg" className="px-8">
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          ) : (
            <Button onClick={startTimer} size="lg" className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Resume
            </Button>
          )}
          
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Dialog */}
        <PomodoroSettings 
          open={showSettings} 
          onOpenChange={setShowSettings}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </CardContent>
      
      {/* Stress Integration */}
      <PomodoroStressIntegration 
        currentMode={mode}
        isRunning={state === "running"}
        selectedTask={selectedTask}
      />
    </Card>
  )
}
