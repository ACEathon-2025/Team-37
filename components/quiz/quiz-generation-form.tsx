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
import { useToast } from "@/components/ui/use-toast"

export function QuizGenerationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<string>("10")
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState<string>("")
  const [topics, setTopics] = useState("")

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      // Auto-generate immediately with default question count
      await handleGenerate(file, selectedQuestionCount || "10")
    }
  }

  const handleQuestionCountChange = (value: string) => {
    setSelectedQuestionCount(value)
  }

  const handleGenerate = async (fileOverride?: File | null, countOverride?: string) => {
    if (!selectedFile && !fileOverride) {
      toast({ title: "No file selected", description: "Please upload a study file to generate a quiz." })
      return
    }
    setIsGenerating(true)
    try {
      const formData = new FormData()
      const fileToUse = typeof fileOverride !== "undefined" ? fileOverride : selectedFile
      if (fileToUse) {
        formData.append("file", fileToUse)
      }
      formData.append("num_questions", (countOverride || selectedQuestionCount || "10"))
      if (title) formData.append("title", title)
      if (subject) formData.append("subject", subject)
      if (topics) formData.append("topics", topics)

      const res = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`)
      }

      const data = await res.json()
      const questions = Array.isArray(data?.questions) ? data.questions : []
      if (!questions.length) {
        toast({ title: "No questions generated", description: "Try a different file or a shorter document." })
        return
      }

      localStorage.setItem("generatedQuiz", JSON.stringify(questions))
      localStorage.setItem("generatedQuizMeta", JSON.stringify({ title: title || "Generated Quiz", subject: subject || "Generated", topics }))
      router.push("/dashboard/quiz/take/generated")
    } catch (err: any) {
      toast({ title: "Generation failed", description: err?.message || "Please try again." })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input id="title" placeholder="e.g., Biology Practice" className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select onValueChange={setSubject}>
              <SelectTrigger id="subject" className="mt-2">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="questions">Number of Questions</Label>
              <Select onValueChange={handleQuestionCountChange} defaultValue={selectedQuestionCount}>
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
          </div>

          <div>
            <Label htmlFor="topics">Topics to Cover (Optional)</Label>
            <Textarea id="topics" placeholder="e.g., Cell division, Genetics" className="mt-2 min-h-[100px]" value={topics} onChange={(e) => setTopics(e.target.value)} />
          </div>

          <div className="rounded-lg border-2 border-dashed border-border/50 bg-background/50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-2 font-medium">Upload Study Materials</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Upload PDFs, notes, or past papers to generate questions
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <FileText className="mr-2 h-4 w-4" />
                  Choose Files
                </span>
              </Button>
            </label>
            {selectedFile && (
              <div className="mt-2 text-sm text-primary">{selectedFile.name}</div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => handleGenerate()} disabled={isGenerating}>
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
