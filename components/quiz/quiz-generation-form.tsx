"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuizGenerationForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate quiz generation
    setTimeout(() => {
      router.push("/dashboard/quiz")
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input id="title" placeholder="e.g., Calculus Midterm Practice" className="mt-2" />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select>
              <SelectTrigger id="subject" className="mt-2">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="questions">Number of Questions</Label>
              <Select>
                <SelectTrigger id="questions" className="mt-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questions</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="25">25 questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select>
                <SelectTrigger id="difficulty" className="mt-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="adaptive">Adaptive (Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="topics">Topics to Cover (Optional)</Label>
            <Textarea id="topics" placeholder="e.g., Derivatives, Integrals, Limits" className="mt-2 min-h-[100px]" />
          </div>

          <div className="rounded-lg border-2 border-dashed border-border/50 bg-background/50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-2 font-medium">Upload Study Materials</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Upload PDFs, notes, or past papers to generate questions
            </p>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
