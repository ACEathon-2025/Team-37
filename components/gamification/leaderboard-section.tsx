import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"

const weeklyLeaderboard = [
  { rank: 1, name: "Sarah Chen", xp: 3250, change: "up", avatar: "SC" },
  { rank: 2, name: "Alex Kumar", xp: 2450, change: "same", avatar: "AK", isCurrentUser: true },
  { rank: 3, name: "Mike Johnson", xp: 2380, change: "up", avatar: "MJ" },
  { rank: 4, name: "Emma Davis", xp: 2150, change: "down", avatar: "ED" },
  { rank: 5, name: "James Wilson", xp: 2050, change: "up", avatar: "JW" },
]

const monthlyLeaderboard = [
  { rank: 1, name: "Alex Kumar", xp: 12450, change: "up", avatar: "AK", isCurrentUser: true },
  { rank: 2, name: "Sarah Chen", xp: 11250, change: "down", avatar: "SC" },
  { rank: 3, name: "Emma Davis", xp: 10380, change: "up", avatar: "ED" },
  { rank: 4, name: "Mike Johnson", xp: 9150, change: "same", avatar: "MJ" },
  { rank: 5, name: "James Wilson", xp: 8950, change: "up", avatar: "JW" },
]

export function LeaderboardSection() {
  return (
    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Trophy className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Leaderboard</h2>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="weekly" className="flex-1">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <div className="space-y-3">
            {weeklyLeaderboard.map((user) => (
              <LeaderboardItem key={user.rank} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <div className="space-y-3">
            {monthlyLeaderboard.map((user) => (
              <LeaderboardItem key={user.rank} user={user} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function LeaderboardItem({ user }: { user: any }) {
  const ChangeIcon = user.change === "up" ? TrendingUp : user.change === "down" ? TrendingDown : Minus

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 ${
        user.isCurrentUser ? "border-primary/50 bg-primary/5" : "border-border/50 bg-background/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
            user.rank === 1
              ? "bg-accent text-accent-foreground"
              : user.rank === 2
                ? "bg-muted text-muted-foreground"
                : user.rank === 3
                  ? "bg-chart-2/20 text-chart-2"
                  : "text-muted-foreground"
          }`}
        >
          {user.rank}
        </span>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
      </div>

      <ChangeIcon
        className={`h-4 w-4 ${
          user.change === "up" ? "text-chart-3" : user.change === "down" ? "text-destructive" : "text-muted-foreground"
        }`}
      />
    </div>
  )
}
