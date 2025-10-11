"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wind, Play, Pause, RotateCcw } from "lucide-react"

interface BreathingCycle {
  phase: "inhale" | "hold" | "exhale" | "pause"
  duration: number
  instruction: string
}

const breathingPatterns = {
  "4-4-4-4": {
    name: "Box Breathing",
    description: "Equal duration for all phases",
    cycles: [
      { phase: "inhale", duration: 4, instruction: "Breathe in slowly" },
      { phase: "hold", duration: 4, instruction: "Hold your breath" },
      { phase: "exhale", duration: 4, instruction: "Breathe out slowly" },
      { phase: "pause", duration: 4, instruction: "Rest and relax" }
    ] as BreathingCycle[]
  },
  "4-7-8": {
    name: "4-7-8 Breathing",
    description: "Calming and relaxing pattern",
    cycles: [
      { phase: "inhale", duration: 4, instruction: "Breathe in through your nose" },
      { phase: "hold", duration: 7, instruction: "Hold your breath" },
      { phase: "exhale", duration: 8, instruction: "Breathe out through your mouth" },
      { phase: "pause", duration: 2, instruction: "Rest before next cycle" }
    ] as BreathingCycle[]
  },
  "triangle": {
    name: "Triangle Breathing",
    description: "Simple three-phase pattern",
    cycles: [
      { phase: "inhale", duration: 4, instruction: "Breathe in deeply" },
      { phase: "exhale", duration: 4, instruction: "Breathe out completely" },
      { phase: "pause", duration: 4, instruction: "Rest and relax" }
    ] as BreathingCycle[]
  }
}

export function BreathingBreak() {
  const [isActive, setIsActive] = useState(false)
  const [currentPattern, setCurrentPattern] = useState<keyof typeof breathingPatterns>("4-4-4-4")
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<BreathingCycle | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const [totalCycles, setTotalCycles] = useState(5)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const pattern = breathingPatterns[currentPattern]

  useEffect(() => {
    if (isActive && currentPhase && timeLeft > 0) {
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
  }, [isActive, currentPhase, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      nextPhase()
    }
  }, [timeLeft, isActive])

  const startBreathing = () => {
    setIsActive(true)
    setCurrentCycleIndex(0)
    setCompletedCycles(0)
    startNextPhase()
  }

  const pauseBreathing = () => {
    setIsActive(false)
  }

  const resetBreathing = () => {
    setIsActive(false)
    setCurrentCycleIndex(0)
    setCompletedCycles(0)
    setCurrentPhase(null)
    setTimeLeft(0)
  }

  const startNextPhase = () => {
    const cycle = pattern.cycles[currentCycleIndex]
    setCurrentPhase(cycle)
    setTimeLeft(cycle.duration)
  }

  const nextPhase = () => {
    const nextIndex = (currentCycleIndex + 1) % pattern.cycles.length
    
    if (nextIndex === 0) {
      // Completed one full cycle
      const newCompletedCycles = completedCycles + 1
      setCompletedCycles(newCompletedCycles)
      
      if (newCompletedCycles >= totalCycles) {
        // Session complete
        setIsActive(false)
        setCurrentPhase(null)
        setTimeLeft(0)
        return
      }
    }
    
    setCurrentCycleIndex(nextIndex)
    startNextPhase()
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "inhale": return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
      case "hold": return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
      case "exhale": return "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
      case "pause": return "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getProgressValue = () => {
    if (!currentPhase) return 0
    return ((currentPhase.duration - timeLeft) / currentPhase.duration) * 100
  }

  const getCircleSize = () => {
    if (!currentPhase) return 50
    
    const progress = getProgressValue() / 100
    switch (currentPhase.phase) {
      case "inhale": return 50 + (progress * 30) // Grow from 50% to 80%
      case "hold": return 80 // Stay large
      case "exhale": return 80 - (progress * 30) // Shrink from 80% to 50%
      case "pause": return 50 // Stay small
      default: return 50
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Breathing Break
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pattern Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Breathing Pattern</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(breathingPatterns).map(([key, pattern]) => (
              <Button
                key={key}
                variant={currentPattern === key ? "default" : "outline"}
                onClick={() => setCurrentPattern(key as keyof typeof breathingPatterns)}
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">{pattern.name}</div>
                  <div className="text-sm opacity-70">{pattern.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Session Settings */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Number of Cycles</label>
          <div className="flex gap-2">
            {[3, 5, 10].map((num) => (
              <Button
                key={num}
                variant={totalCycles === num ? "default" : "outline"}
                size="sm"
                onClick={() => setTotalCycles(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div
              className="absolute rounded-full bg-gradient-to-br from-primary/20 to-primary/40 transition-all duration-1000 ease-in-out"
              style={{
                width: `${getCircleSize()}%`,
                height: `${getCircleSize()}%`,
                transform: "translate(-50%, -50%)"
              }}
            />
            <div className="relative z-10 text-center">
              {currentPhase && (
                <>
                  <div className="text-4xl font-bold mb-2">
                    {timeLeft}
                  </div>
                  <Badge className={getPhaseColor(currentPhase.phase)}>
                    {currentPhase.phase.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2 max-w-32">
                    {currentPhase.instruction}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        {currentPhase && (
          <div className="space-y-2">
            <Progress value={getProgressValue()} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              Cycle {completedCycles + 1} of {totalCycles}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={startBreathing} size="lg" className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Start Breathing
            </Button>
          ) : (
            <Button onClick={pauseBreathing} variant="outline" size="lg" className="px-8">
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetBreathing} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Session Complete */}
        {!isActive && completedCycles === totalCycles && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-green-600 dark:text-green-400 font-medium mb-1">
              Session Complete! 🌟
            </div>
            <div className="text-sm text-muted-foreground">
              Great job! You've completed {totalCycles} breathing cycles.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
