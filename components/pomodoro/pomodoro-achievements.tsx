"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Award, Trophy, Target, Flame, Clock, Star, Zap, Crown, Gift, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "streak" | "total" | "daily" | "special"
  requirement: number
  current: number
  unlocked: boolean
  unlockedAt?: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface UserStats {
  totalPomodoros: number
  currentStreak: number
  longestStreak: number
  dailyGoal: number
  dailyPomodoros: number
  totalPoints: number
  level: number
  experience: number
  experienceToNext: number
}

const achievements: Omit<Achievement, "current" | "unlocked" | "unlockedAt">[] = [
  // Streak Achievements
  {
    id: "first_streak",
    title: "Getting Started",
    description: "Complete your first pomodoro streak",
    icon: "🎯",
    category: "streak",
    requirement: 1,
    points: 10,
    rarity: "common"
  },
  {
    id: "week_streak",
    title: "Week Warrior",
    description: "Maintain a 7-day pomodoro streak",
    icon: "🔥",
    category: "streak",
    requirement: 7,
    points: 50,
    rarity: "rare"
  },
  {
    id: "month_streak",
    title: "Monthly Master",
    description: "Maintain a 30-day pomodoro streak",
    icon: "👑",
    category: "streak",
    requirement: 30,
    points: 200,
    rarity: "legendary"
  },
  
  // Total Achievements
  {
    id: "first_10",
    title: "Focus Beginner",
    description: "Complete 10 pomodoros",
    icon: "⭐",
    category: "total",
    requirement: 10,
    points: 25,
    rarity: "common"
  },
  {
    id: "hundred_pomodoros",
    title: "Century Club",
    description: "Complete 100 pomodoros",
    icon: "💯",
    category: "total",
    requirement: 100,
    points: 100,
    rarity: "epic"
  },
  {
    id: "thousand_pomodoros",
    title: "Pomodoro Master",
    description: "Complete 1000 pomodoros",
    icon: "🏆",
    category: "total",
    requirement: 1000,
    points: 500,
    rarity: "legendary"
  },
  
  // Daily Achievements
  {
    id: "daily_goal_1",
    title: "Daily Dedication",
    description: "Complete your daily goal once",
    icon: "🎯",
    category: "daily",
    requirement: 1,
    points: 15,
    rarity: "common"
  },
  {
    id: "daily_goal_week",
    title: "Week of Focus",
    description: "Hit daily goal 7 days in a row",
    icon: "📅",
    category: "daily",
    requirement: 7,
    points: 75,
    rarity: "rare"
  },
  
  // Special Achievements
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete a pomodoro before 7 AM",
    icon: "🌅",
    category: "special",
    requirement: 1,
    points: 30,
    rarity: "rare"
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete a pomodoro after 10 PM",
    icon: "🦉",
    category: "special",
    requirement: 1,
    points: 30,
    rarity: "rare"
  },
  {
    id: "marathon",
    title: "Marathon Runner",
    description: "Complete 10 pomodoros in a single day",
    icon: "🏃",
    category: "special",
    requirement: 10,
    points: 100,
    rarity: "epic"
  }
]

const motivationalQuotes = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Focus on being productive instead of busy. - Tim Ferriss",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus. - Alexander Graham Bell",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort. - Paul J. Meyer",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Focus on being productive instead of busy. - Tim Ferriss"
]

export function PomodoroAchievements() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPomodoros: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyGoal: 4,
    dailyPomodoros: 0,
    totalPoints: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100
  })
  
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([])
  const [showQuote, setShowQuote] = useState(false)
  const [currentQuote, setCurrentQuote] = useState("")
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const { toast } = useToast()

  // Load user data
  useEffect(() => {
    const savedStats = localStorage.getItem("pomodoro-user-stats")
    const savedAchievements = localStorage.getItem("pomodoro-achievements")
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
    
    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements))
    } else {
      // Initialize achievements
      const initialAchievements = achievements.map(achievement => ({
        ...achievement,
        current: 0,
        unlocked: false
      }))
      setUserAchievements(initialAchievements)
    }
  }, [])

  // Listen for pomodoro completion
  useEffect(() => {
    const handlePomodoroComplete = (event: CustomEvent) => {
      updateStats()
      checkAchievements()
      showMotivationalQuote()
    }

    window.addEventListener("pomodoroComplete", handlePomodoroComplete as EventListener)
    return () => window.removeEventListener("pomodoroComplete", handlePomodoroComplete as EventListener)
  }, [])

  const updateStats = () => {
    const sessions = JSON.parse(localStorage.getItem("pomodoro-sessions") || "[]")
    const today = new Date().toISOString().split('T')[0]
    
    const newStats: UserStats = {
      totalPomodoros: sessions.length,
      currentStreak: calculateCurrentStreak(sessions),
      longestStreak: calculateLongestStreak(sessions),
      dailyGoal: 4,
      dailyPomodoros: sessions.filter((s: any) => s.date === today).length,
      totalPoints: userStats.totalPoints,
      level: userStats.level,
      experience: userStats.experience,
      experienceToNext: userStats.experienceToNext
    }

    setUserStats(newStats)
    localStorage.setItem("pomodoro-user-stats", JSON.stringify(newStats))
  }

  const calculateCurrentStreak = (sessions: any[]): number => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const daySessions = sessions.filter(s => s.date === dateStr)
      
      if (daySessions.length > 0) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  }

  const calculateLongestStreak = (sessions: any[]): number => {
    let longestStreak = 0
    let currentStreak = 0
    const dates = [...new Set(sessions.map(s => s.date))].sort()
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || isConsecutiveDay(dates[i-1], dates[i])) {
        currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }
    }
    
    return Math.max(longestStreak, currentStreak)
  }

  const isConsecutiveDay = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
  }

  const checkAchievements = () => {
    const updatedAchievements = userAchievements.map(achievement => {
      let current = 0
      
      switch (achievement.id) {
        case "first_streak":
        case "week_streak":
        case "month_streak":
          current = userStats.currentStreak
          break
        case "first_10":
        case "hundred_pomodoros":
        case "thousand_pomodoros":
          current = userStats.totalPomodoros
          break
        case "daily_goal_1":
          current = userStats.dailyPomodoros >= userStats.dailyGoal ? 1 : 0
          break
        case "daily_goal_week":
          current = calculateDailyGoalStreak()
          break
        default:
          current = achievement.current
      }
      
      const wasUnlocked = achievement.unlocked
      const isNowUnlocked = !wasUnlocked && current >= achievement.requirement
      
      if (isNowUnlocked) {
        const newAchievement = {
          ...achievement,
          current,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        }
        
        setNewAchievements(prev => [...prev, newAchievement])
        
        // Award points
        const newStats = {
          ...userStats,
          totalPoints: userStats.totalPoints + achievement.points,
          experience: userStats.experience + achievement.points
        }
        
        // Check for level up
        if (newStats.experience >= newStats.experienceToNext) {
          newStats.level += 1
          newStats.experience -= newStats.experienceToNext
          newStats.experienceToNext = Math.floor(newStats.experienceToNext * 1.2)
          
          toast({
            title: "Level Up! 🎉",
            description: `You've reached level ${newStats.level}!`,
            duration: 5000
          })
        }
        
        setUserStats(newStats)
        localStorage.setItem("pomodoro-user-stats", JSON.stringify(newStats))
        
        toast({
          title: "Achievement Unlocked! 🏆",
          description: achievement.title,
          duration: 5000
        })
        
        return newAchievement
      }
      
      return { ...achievement, current }
    })
    
    setUserAchievements(updatedAchievements)
    localStorage.setItem("pomodoro-achievements", JSON.stringify(updatedAchievements))
  }

  const calculateDailyGoalStreak = (): number => {
    // This would calculate consecutive days hitting daily goal
    // For now, return a placeholder
    return 0
  }

  const showMotivationalQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
    setShowQuote(true)
    
    setTimeout(() => {
      setShowQuote(false)
    }, 5000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "rare": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "epic": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "legendary": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getLevelProgress = () => {
    return (userStats.experience / userStats.experienceToNext) * 100
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements & Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Level */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-2xl font-bold">Level {userStats.level}</div>
                <div className="text-sm text-muted-foreground">
                  {userStats.totalPoints} points
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {userStats.experience}/{userStats.experienceToNext}
                </div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
            </div>
            <Progress value={getLevelProgress()} className="h-2" />
          </div>

          {/* Daily Goal */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="font-medium">Daily Goal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{userStats.dailyPomodoros}/{userStats.dailyGoal}</span>
              <Progress value={(userStats.dailyPomodoros / userStats.dailyGoal) * 100} className="w-16 h-2" />
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">Current Streak</span>
            </div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {userStats.currentStreak} days
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h4 className="font-medium mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              {userAchievements
                .filter(a => a.unlocked)
                .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
                .slice(0, 3)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      +{achievement.points} pts
                    </Badge>
                  </div>
                ))}
            </div>
          </div>

          {/* All Achievements Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Award className="h-4 w-4 mr-2" />
                View All Achievements
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Achievements</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                {userAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" 
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium ${achievement.unlocked ? "" : "opacity-50"}`}>
                            {achievement.title}
                          </span>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <div className={`text-sm mb-2 ${achievement.unlocked ? "" : "opacity-50"}`}>
                          {achievement.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(achievement.current / achievement.requirement) * 100} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-sm text-muted-foreground">
                            {achievement.current}/{achievement.requirement}
                          </span>
                        </div>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Motivational Quote Overlay */}
      {showQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md mx-4 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
            <blockquote className="text-lg font-medium italic mb-4">
              "{currentQuote.split(' - ')[0]}"
            </blockquote>
            <cite className="text-sm text-muted-foreground">
              - {currentQuote.split(' - ')[1]}
            </cite>
          </div>
        </div>
      )}

      {/* New Achievement Notification */}
      {newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {newAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg mb-2 animate-in slide-in-from-right"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-bold">Achievement Unlocked!</div>
                  <div className="text-sm">{achievement.title}</div>
                  <div className="text-xs opacity-90">+{achievement.points} points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
