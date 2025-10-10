"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type BreathingBreakProps = {
  open: boolean
  onClose: () => void
  durationSec?: number
}

export function BreathingBreak({ open, onClose, durationSec = 60 }: BreathingBreakProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [remaining, setRemaining] = useState(durationSec)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    setPhase("inhale")
    setRemaining(durationSec)

    const cycleMs = 4000 + 2000 + 4000 // inhale 4s, hold 2s, exhale 4s
    const tick = () => setRemaining((r) => (r > 0 ? r - 1 : 0))
    const interval = window.setInterval(tick, 1000)
    timerRef.current = interval

    let phaseStart = Date.now()
    let currentPhase: typeof phase = "inhale"

    const raf = () => {
      if (!open) return
      const elapsed = (Date.now() - phaseStart) % cycleMs
      if (elapsed < 4000) currentPhase = "inhale"
      else if (elapsed < 6000) currentPhase = "hold"
      else currentPhase = "exhale"
      setPhase((p) => (p === currentPhase ? p : currentPhase))
      if (remaining > 0) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [open, durationSec])

  useEffect(() => {
    if (!open) return
    if (remaining <= 0) onClose()
  }, [remaining, open, onClose])

  const size = phase === "inhale" ? "scale-100" : phase === "hold" ? "scale-95" : "scale-75"
  const instruction = phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mindful Minute</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className={`relative h-40 w-40 rounded-full bg-primary/10 transition-transform duration-700 ease-in-out ${size}`}
          >
            <div className="absolute inset-4 rounded-full bg-primary/20" />
            <div className="absolute inset-8 rounded-full bg-primary/30" />
          </div>
          <div className="text-lg font-semibold">{instruction}</div>
          <div className="text-sm text-muted-foreground">Time left: {remaining}s</div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={onClose}>Skip</Button>
            <Button onClick={onClose}>I feel better</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


