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
  const [subject, setSubject] = useState<string>("Biology")
  const [topics, setTopics] = useState("")

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      await handleGenerate(file, selectedQuestionCount || "10")
    }
  }

  const handleQuestionCountChange = (value: string) => setSelectedQuestionCount(value)

  const handleGenerate = async (fileOverride?: File | null, countOverride?: string) => {
    if (!selectedFile && !fileOverride) {
      toast({ title: "No file selected", description: "Please upload a study file to generate a quiz." })
      return
    }
    setIsGenerating(true)
    try {
      const formData = new FormData()
      const fileToUse = fileOverride || selectedFile
      if (fileToUse) formData.append("file", fileToUse)
      formData.append("num_questions", (countOverride || selectedQuestionCount || "10"))
      formData.append("subject", subject)
      if (title) formData.append("title", title)
      if (topics) formData.append("topics", topics)

      const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: formData })
      let data = { questions: [] as any[] }
      if (res.ok) data = await res.json()

      // fallback dummy questions if backend fails
      if (!data.questions || !data.questions.length) {
        const dummyQuestions: Record<string, any[]> = {
          Mathematics: [...Array(10).keys()].map((i) => ({
            question: `Dummy Math Q${i + 1}?`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
          })),
          Physics: [...Array(10).keys()].map((i) => ({
            question: `Dummy Physics Q${i + 1}?`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
          })),
          Chemistry: [...Array(10).keys()].map((i) => ({
            question: `Dummy Chemistry Q${i + 1}?`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
          })),
          Biology: [...Array(10).keys()].map((i) => ({
            question: `Dummy Biology Q${i + 1} (Anatomy)?`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
          })),
          "Computer Science": [...Array(10).keys()].map((i) => ({
            question: `Dummy CS Q${i + 1}?`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
          })),
        }
        data.questions = (dummyQuestions[subject] || dummyQuestions["Biology"]).slice(0, Number(selectedQuestionCount))
      }

      localStorage.setItem("generatedQuiz", JSON.stringify(data.questions))
      localStorage.setItem("generatedQuizMeta", JSON.stringify({
        title: title || "Generated Quiz",
        subject,
        topics,
        num_questions: Number(selectedQuestionCount),
      }))
      router.push("/dashboard/quiz/take/generated")
    } catch (err: any) {
      toast({ title: "Generation failed", description: err?.message || "Please try again." })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-8 space-y-6">
        <div>
          <Label htmlFor="title">Quiz Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select onValueChange={setSubject}>
            <SelectTrigger id="subject" className="mt-2">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="questions">Number of Questions</Label>
          <Select onValueChange={handleQuestionCountChange} defaultValue={selectedQuestionCount}>
            {["5","10","15","20","25"].map((n) => (
              <SelectItem key={n} value={n}>{n} questions</SelectItem>
            ))}
          </Select>
        </div>

        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <input type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} id="file-upload" onChange={handleFileChange}/>
          <label htmlFor="file-upload">
            <Button variant="outline">Upload File</Button>
          </label>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={() => handleGenerate()} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Quiz"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
