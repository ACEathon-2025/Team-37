"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Camera, Heart } from "lucide-react"
import SimpleStressDetector from "./SimpleStressDetector"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI tutor. I'm here to help you understand any topic, answer questions, and provide personalized explanations. What would you like to learn about today?",
    timestamp: new Date(),
  },
]

const suggestedQuestions = [
  "Explain derivatives in simple terms",
  "Help me understand quantum mechanics",
  "What's the difference between DNA and RNA?",
  "How do I solve quadratic equations?",
]

export function AITutorChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [stressLevel, setStressLevel] = useState("low")

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"
      
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch(`${backendUrl}/tutor/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          stress_level: stressLevel,
          conversation_history: conversationHistory
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Tutor chat error:", error)
      
      // Fallback response on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, you can try asking a simpler question or come back later.",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // --- Stress detection handler ---
  const handleStressDetected = async (score: number) => {
    let level = "low"
    if (score > 30 && score <= 60) level = "medium"
    else if (score > 60) level = "high"
    setStressLevel(level)

    // Send emotion data to backend for analytics
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"
      await fetch(`${backendUrl}/emotion-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stress_score: score,
          timestamp: new Date().toISOString()
        }),
      })
    } catch (error) {
      console.error("Failed to log emotion data:", error)
      // Don't show error to user, just log it
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Stress Monitor Banner */}
        <div className="border-b border-border/40 bg-background/80 p-4">
          <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                <Camera className="h-4 w-4 text-chart-3" />
              </div>
              <div>
                <p className="text-sm font-medium">Stress Monitoring Active</p>
                <p className="text-xs text-muted-foreground">Simulated stress detection for AI adaptation</p>
              </div>
            </div>
            <Badge variant="outline" className="border-chart-3 text-chart-3">
              <Heart className="mr-1 h-3 w-3" />
              {stressLevel}
            </Badge>
          </div>
        </div>

        {/* Stress detection disabled for now */}
        <SimpleStressDetector onStressDetected={handleStressDetected} hidden={true} />

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="container mx-auto max-w-4xl space-y-6 px-4 lg:px-8">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex max-w-[80%] flex-col gap-2 ${message.role === "user" ? "items-end" : ""}`}>
                  <Card
                    className={`p-4 ${
                      message.role === "user"
                        ? "border-primary/50 bg-primary text-primary-foreground"
                        : "border-border/50 bg-card/50 backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </Card>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <Card className="border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                </Card>
              </div>
            )}

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground">Suggested questions:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto justify-start text-left text-sm bg-transparent"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <Lightbulb className="mr-2 h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-2">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/40 bg-background/80 p-4">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <div className="flex gap-3">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden w-80 border-l border-border/40 bg-background/50 p-6 lg:block">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Learning Context</h3>
            <Card className="border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Subject</span>
                  <Badge variant="outline">Mathematics</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulty Level</span>
                  <span className="font-medium">Intermediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Learning Style</span>
                  <span className="font-medium">Visual</span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Practice Quiz
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Lightbulb className="mr-2 h-4 w-4" />
                Get Study Tips
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Recent Topics</h3>
            <div className="space-y-2">
              {["Calculus Derivatives", "Linear Algebra", "Quantum Physics"].map((topic, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start text-sm">
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
