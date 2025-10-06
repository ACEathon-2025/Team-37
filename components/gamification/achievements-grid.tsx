import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Lock, CheckCircle2, Flame, BookOpen, Brain, Target, Star } from "lucide-react"

const achievements = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first quiz",
    icon: Trophy,
    unlocked: true,
    progress: 100,
    xp: 50,
    category: "beginner",
  },
  {
    id: "2",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    unlocked: true,
    progress: 100,
    xp: 100,
    category: "streak",
  },
  {
    id: "3",
    title: "Quiz Master",
    description: "Complete 50 quizzes",
    icon: BookOpen,
    unlocked: false,
    progress: 68,
    current: 34,
    total: 50,
    xp: 200,
    category: "quiz",
  },
  {
    id: "4",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: Star,
    unlocked: false,
    progress: 0,
    xp: 150,
    category: "quiz",
  },
  {
    id: "5",
    title: "Knowledge Seeker",
    description: "Ask 100 questions to AI tutor",
    icon: Brain,
    unlocked: false,
    progress: 45,
    current: 45,
    total: 100,
    xp: 150,
    category: "learning",
  },
  {
    id: "6",
    title: "Stress Manager",
    description: "Complete 10 quizzes with low stress",
    icon: Target,
    unlocked: true,
    progress: 100,
    xp: 125,
    category: "wellness",
  },
]

export function AchievementsGrid() {
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({achievements.length})</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {unlockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {lockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: any }) {
  const Icon = achievement.unlocked ? achievement.icon : Lock

  return (
    <Card
      className={`border-border/50 p-6 backdrop-blur-sm ${
        achievement.unlocked ? "bg-card/50" : "bg-card/30 opacity-75"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            achievement.unlocked ? "bg-primary/10" : "bg-muted"
          }`}
        >
          <Icon className={`h-6 w-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        {achievement.unlocked ? (
          <Badge variant="default" className="bg-chart-3 text-chart-3-foreground">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Unlocked
          </Badge>
        ) : (
          <Badge variant="outline">Locked</Badge>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold">{achievement.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{achievement.description}</p>

      {!achievement.unlocked && achievement.progress > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {achievement.current} / {achievement.total}
            </span>
          </div>
          <Progress value={achievement.progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Reward</span>
        <span className="font-medium text-primary">+{achievement.xp} XP</span>
      </div>
    </Card>
  )
}
