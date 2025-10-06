import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Problem } from "@/components/problem"
import { Solution } from "@/components/solution"
import { Features } from "@/components/features"
import { DemoFlow } from "@/components/demo-flow"
import { TechStack } from "@/components/tech-stack"
import { Impact } from "@/components/impact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <DemoFlow />
      <TechStack />
      <Impact />
      <Footer />
    </main>
  )
}
