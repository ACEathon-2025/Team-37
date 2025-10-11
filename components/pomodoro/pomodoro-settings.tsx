"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PomodoroSettings as SettingsType } from "./pomodoro-timer"

interface PomodoroSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: SettingsType
  onSettingsChange: (settings: SettingsType) => void
}

export function PomodoroSettings({ open, onOpenChange, settings, onSettingsChange }: PomodoroSettingsProps) {
  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const backgroundSounds = [
    { id: "none", name: "None", description: "No background sound" },
    { id: "rain", name: "Rain", description: "Gentle rain sounds" },
    { id: "forest", name: "Forest", description: "Nature sounds" },
    { id: "ocean", name: "Ocean", description: "Ocean waves" },
    { id: "white-noise", name: "White Noise", description: "Steady white noise" },
    { id: "instrumental", name: "Instrumental", description: "Soft instrumental music" }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Timer Durations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timer Durations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pomodoro-duration">Pomodoro Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.pomodoroDuration]}
                    onValueChange={(value) => updateSetting("pomodoroDuration", value[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[3rem]">{settings.pomodoroDuration} min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short-break-duration">Short Break Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.shortBreakDuration]}
                    onValueChange={(value) => updateSetting("shortBreakDuration", value[0])}
                    min={1}
                    max={15}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[3rem]">{settings.shortBreakDuration} min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-break-duration">Long Break Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.longBreakDuration]}
                    onValueChange={(value) => updateSetting("longBreakDuration", value[0])}
                    min={10}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[3rem]">{settings.longBreakDuration} min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-break-interval">Long Break Interval</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.longBreakInterval]}
                    onValueChange={(value) => updateSetting("longBreakInterval", value[0])}
                    min={2}
                    max={8}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[3rem]">After {settings.longBreakInterval} pomodoros</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
                  <p className="text-sm text-muted-foreground">Automatically start break timers</p>
                </div>
                <Switch
                  id="auto-start-breaks"
                  checked={settings.autoStartBreaks}
                  onCheckedChange={(checked) => updateSetting("autoStartBreaks", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-start-pomodoros">Auto-start Pomodoros</Label>
                  <p className="text-sm text-muted-foreground">Automatically start next pomodoro after breaks</p>
                </div>
                <Switch
                  id="auto-start-pomodoros"
                  checked={settings.autoStartPomodoros}
                  onCheckedChange={(checked) => updateSetting("autoStartPomodoros", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Sound */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications & Sound</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-enabled">Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">Play sound when timer completes</p>
                </div>
                <Switch
                  id="sound-enabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-enabled">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="background-sound">Background Sound</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select background sound" />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundSounds.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        <div>
                          <div className="font-medium">{sound.name}</div>
                          <div className="text-sm text-muted-foreground">{sound.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reset Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm("Are you sure you want to reset all settings to default?")) {
                    onSettingsChange({
                      pomodoroDuration: 25,
                      shortBreakDuration: 5,
                      longBreakDuration: 15,
                      longBreakInterval: 4,
                      soundEnabled: true,
                      notificationsEnabled: true,
                      autoStartBreaks: true,
                      autoStartPomodoros: false
                    })
                  }
                }}
              >
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
