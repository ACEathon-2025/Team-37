"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>Create a new study note to organize your learning materials.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="note-title">Note Title</Label>
            <Input id="note-title" placeholder="e.g., Calculus Derivatives Summary" className="mt-2" />
          </div>

          <div>
            <Label htmlFor="note-subject">Subject</Label>
            <Select>
              <SelectTrigger id="note-subject" className="mt-2">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note-content">Content</Label>
            <Textarea id="note-content" placeholder="Start writing your notes..." className="mt-2 min-h-[200px]" />
          </div>

          <div>
            <Label htmlFor="note-tags">Tags (comma separated)</Label>
            <Input id="note-tags" placeholder="e.g., derivatives, calculus, math" className="mt-2" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
