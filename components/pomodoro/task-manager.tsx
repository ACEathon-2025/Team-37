"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Play, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface Task {
  id: string
  title: string
  category: "Work" | "Study" | "Personal"
  pomodorosCompleted: number
  estimatedPomodoros: number
  createdAt: Date
  completedAt?: Date
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({ title: "", category: "Work" as const, estimatedPomodoros: 1 })
  const { toast } = useToast()

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("pomodoro-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      }))
      setTasks(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      })
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      category: newTask.category,
      pomodorosCompleted: 0,
      estimatedPomodoros: newTask.estimatedPomodoros,
      createdAt: new Date()
    }

    setTasks([...tasks, task])
    setNewTask({ title: "", category: "Work", estimatedPomodoros: 1 })
    setIsDialogOpen(false)
    
    toast({
      title: "Task Added",
      description: `"${task.title}" has been added to your tasks`
    })
  }

  const updateTask = () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      })
      return
    }

    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...editingTask, title: editingTask.title.trim() }
        : task
    ))
    setEditingTask(null)
    
    toast({
      title: "Task Updated",
      description: `"${editingTask.title}" has been updated`
    })
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
    
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
    
    toast({
      title: "Task Deleted",
      description: `"${task?.title}" has been deleted`
    })
  }

  const incrementPomodoros = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
        : task
    ))
  }

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "Work": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Study": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Personal": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tasks
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value: Task["category"]) => setNewTask({ ...newTask, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimated">Estimated Pomodoros</Label>
                  <Input
                    id="estimated"
                    type="number"
                    min="1"
                    max="10"
                    value={newTask.estimatedPomodoros}
                    onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <Button onClick={addTask} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet</p>
            <p className="text-sm">Add your first task to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                selectedTask?.id === task.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {task.pomodorosCompleted}/{task.estimatedPomodoros} pomodoros
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingTask(task)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTask(task.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Task Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingTask.category} onValueChange={(value: Task["category"]) => setEditingTask({ ...editingTask, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-estimated">Estimated Pomodoros</Label>
                  <Input
                    id="edit-estimated"
                    type="number"
                    min="1"
                    max="10"
                    value={editingTask.estimatedPomodoros}
                    onChange={(e) => setEditingTask({ ...editingTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <Button onClick={updateTask} className="w-full">
                  Update Task
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export { TaskManager }
