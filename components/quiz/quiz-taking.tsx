"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

type GeneratedQuestion = {
  question: string
  options: string[]
  correct_answer?: string
}

const dummyQuestions: Record<string, GeneratedQuestion[]> = {
  Mathematics: [
    { question: "What is 5 + 7?", options: ["10", "11", "12", "13"], correct_answer: "12" },
    { question: "Derivative of x^2?", options: ["x", "2x", "x^2", "1"], correct_answer: "2x" },
    { question: "Integral of 1 dx?", options: ["1", "x", "x+1", "0"], correct_answer: "x" },
    { question: "Solve 2x = 8", options: ["2", "3", "4", "5"], correct_answer: "4" },
    { question: "Square root of 81?", options: ["7", "8", "9", "10"], correct_answer: "9" },
    { question: "10 % of 200?", options: ["10", "20", "25", "30"], correct_answer: "20" },
    { question: "Factor of x^2 - 9?", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-1)(x+9)", "None"], correct_answer: "(x-3)(x+3)" },
    { question: "Value of π?", options: ["2.14", "3.14", "3.41", "3.44"], correct_answer: "3.14" },
    { question: "7 * 6?", options: ["42", "36", "48", "40"], correct_answer: "42" },
    { question: "Log10(100)?", options: ["1", "2", "10", "100"], correct_answer: "2" },
  ],
  Physics: [
    { question: "Unit of Force?", options: ["Joule", "Newton", "Pascal", "Watt"], correct_answer: "Newton" },
    { question: "Speed of light?", options: ["3e8 m/s", "1e8 m/s", "5e8 m/s", "1e6 m/s"], correct_answer: "3e8 m/s" },
    { question: "F = ma formula is?", options: ["Newton's Second Law", "First Law", "Third Law", "Law of Gravitation"], correct_answer: "Newton's Second Law" },
    { question: "Acceleration unit?", options: ["m/s", "m/s^2", "N", "J"], correct_answer: "m/s^2" },
    { question: "Gravitational acceleration on Earth?", options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9 m/s²"], correct_answer: "9.8 m/s²" },
    { question: "Energy unit?", options: ["Watt", "Newton", "Joule", "Pascal"], correct_answer: "Joule" },
    { question: "Ohm's Law?", options: ["V=IR", "P=IV", "F=ma", "E=mc²"], correct_answer: "V=IR" },
    { question: "Unit of Pressure?", options: ["Pascal", "Newton", "Joule", "Volt"], correct_answer: "Pascal" },
    { question: "Momentum formula?", options: ["p=mv", "F=ma", "E=mc²", "V=IR"], correct_answer: "p=mv" },
    { question: "Power formula?", options: ["P=IV", "P=V²/R", "Both", "None"], correct_answer: "Both" },
  ],
  Chemistry: [
    { question: "H2O is?", options: ["Water", "Hydrogen Peroxide", "Oxygen", "Hydrogen"], correct_answer: "Water" },
    { question: "Atomic number of Carbon?", options: ["6", "12", "14", "8"], correct_answer: "6" },
    { question: "pH of neutral solution?", options: ["0", "7", "14", "1"], correct_answer: "7" },
    { question: "NaCl is?", options: ["Salt", "Sugar", "Baking Soda", "Acid"], correct_answer: "Salt" },
    { question: "Gas released in photosynthesis?", options: ["Oxygen", "CO2", "Nitrogen", "Hydrogen"], correct_answer: "Oxygen" },
    { question: "Symbol for Gold?", options: ["Au", "Ag", "Gd", "Go"], correct_answer: "Au" },
    { question: "HCl is?", options: ["Acid", "Base", "Salt", "Metal"], correct_answer: "Acid" },
    { question: "Molecular weight of H2O?", options: ["16", "18", "20", "22"], correct_answer: "18" },
    { question: "Boiling point of water?", options: ["100°C", "90°C", "80°C", "120°C"], correct_answer: "100°C" },
    { question: "Chemical formula of ammonia?", options: ["NH3", "H2O", "CH4", "CO2"], correct_answer: "NH3" },
  ],
  Biology: [
    { question: "Study of cells is called?", options: ["Cytology", "Genetics", "Botany", "Zoology"], correct_answer: "Cytology" },
    { question: "Blood group with no antigens?", options: ["A", "B", "O", "AB"], correct_answer: "O" },
    { question: "Powerhouse of cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], correct_answer: "Mitochondria" },
    { question: "Basic unit of life?", options: ["Cell", "Atom", "Molecule", "Organ"], correct_answer: "Cell" },
    { question: "DNA stands for?", options: ["Deoxyribonucleic Acid", "Ribonucleic Acid", "Protein", "Carbohydrate"], correct_answer: "Deoxyribonucleic Acid" },
    { question: "Organ of respiration?", options: ["Lungs", "Heart", "Kidney", "Liver"], correct_answer: "Lungs" },
    { question: "Human anatomy study?", options: ["Anatomy", "Physiology", "Histology", "Genetics"], correct_answer: "Anatomy" },
    { question: "Red pigment in blood?", options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"], correct_answer: "Hemoglobin" },
    { question: "Plant photosynthesis occurs in?", options: ["Chloroplast", "Mitochondria", "Nucleus", "Cytoplasm"], correct_answer: "Chloroplast" },
    { question: "Brain is part of?", options: ["CNS", "PNS", "Endocrine", "Digestive"], correct_answer: "CNS" },
  ],
  "Computer Science": [
    { question: "What is HTML?", options: ["Programming Language", "Markup Language", "Database", "OS"], correct_answer: "Markup Language" },
    { question: "Python is?", options: ["Snake", "Programming Language", "Car", "OS"], correct_answer: "Programming Language" },
    { question: "What is CSS used for?", options: ["Styling", "Logic", "Database", "Networking"], correct_answer: "Styling" },
    { question: "Binary of 10?", options: ["1010", "1001", "1100", "1110"], correct_answer: "1010" },
    { question: "RAM stands for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Access Memory", "Run Access Memory"], correct_answer: "Random Access Memory" },
    { question: "CPU stands for?", options: ["Central Processing Unit", "Computer Power Unit", "Central Program Unit", "Compute Process Unit"], correct_answer: "Central Processing Unit" },
    { question: "Function of OS?", options: ["Manage Hardware", "Write Code", "Design DB", "None"], correct_answer: "Manage Hardware" },
    { question: "Algorithm is?", options: ["Step by step procedure", "Code", "Database", "App"], correct_answer: "Step by step procedure" },
    { question: "IP address identifies?", options: ["Device", "Network", "Person", "File"], correct_answer: "Device" },
    { question: "Loop in programming?", options: ["Repeat", "Stop", "Break", "Conditional"], correct_answer: "Repeat" },
  ],
}

export function QuizTaking({ quizId }: { quizId: string }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ isCorrect: boolean }[]>([])
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState<string>("Mathematics") // Default subject
  const [numQuestions, setNumQuestions] = useState<number>(5)

  const progress = useMemo(() => ((currentQuestion + 1) / Math.max(questions.length, 1)) * 100, [
    currentQuestion,
    questions.length,
  ])

  const generateQuiz = () => {
    setLoading(true)
    try {
      let allQuestions = dummyQuestions[subject] || dummyQuestions["Mathematics"]
      setQuestions(allQuestions.slice(0, numQuestions))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    const current = questions[currentQuestion]
    const correctIndex = current.options.findIndex(
      (opt) => opt.trim().toLowerCase() === current.correct_answer?.trim().toLowerCase()
    )
    const isCorrect = selectedAnswer !== null && selectedAnswer === correctIndex
    setAnswers((prev) => [...prev, { isCorrect }])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      // Save results locally
      localStorage.setItem("quizResults", JSON.stringify({ score: Math.round((answers.filter(a => a.isCorrect).length / questions.length) * 100), feedback: "Focus on reviewing key concepts and practicing more problems." }))
      router.push(`/dashboard/quiz/results/${quizId}`)
    }
  }

  if (loading) return <div className="text-center mt-8">Generating quiz...</div>

  if (!questions.length)
    return (
      <div className="text-center mt-8 space-y-4">
        <select onChange={(e) => setSubject(e.target.value)} className="border p-2 rounded">
          {Object.keys(dummyQuestions).map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>
        <select onChange={(e) => setNumQuestions(Number(e.target.value))} className="border p-2 rounded ml-2">
          {[5, 10].map((n) => (
            <option key={n} value={n}>{n} Questions</option>
          ))}
        </select>
        <Button onClick={generateQuiz}>Generate Quiz</Button>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
        <div className="mb-6">
          <Badge variant="outline" className="mb-4">
            Generated
          </Badge>
          <h2 className="text-2xl font-semibold leading-relaxed">{questions[currentQuestion].question}</h2>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
          onValueChange={(val) => setSelectedAnswer(Number(val))}
          className="space-y-3"
        >
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6">
          <Button onClick={handleNext} disabled={selectedAnswer === null}>
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
