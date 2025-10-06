"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Clock } from "lucide-react"
import { CreateNoteDialog } from "./create-note-dialog"

const notes = [
  {
    id: "1",
    title: "Calculus Derivatives Notes",
    subject: "Mathematics",
    content: "Key concepts: Power rule, chain rule, product rule...",
    lastEdited: "2 hours ago",
    tags: ["derivatives", "calculus"],
  },
  {
    id: "2",
    title: "Quantum Mechanics Summary",
    subject: "Physics",
    content: "Wave-particle duality, Heisenberg uncertainty principle...",
    lastEdited: "1 day ago",
    tags: ["quantum", "physics"],
  },
  {
    id: "3",
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    content: "Substitution reactions, elimination reactions, addition reactions...",
    lastEdited: "3 days ago",
    tags: ["organic", "reactions"],
  },
  {
    id: "4",
    title: "Linear Algebra Concepts",
    subject: "Mathematics",
    content: "Vector spaces, linear transformations, eigenvalues...",
    lastEdited: "1 week ago",
    tags: ["linear-algebra", "vectors"],
  },
]

export function NotesList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:bg-card/70"
          >
            <div className="mb-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {note.subject}
                </Badge>
              </div>
              <h3 className="mb-2 text-lg font-semibold leading-snug">{note.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{note.lastEdited}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs hover:bg-transparent">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateNoteDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
