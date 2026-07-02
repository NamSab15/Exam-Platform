'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { Sliders, Calendar, ArrowRight, ArrowLeft } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/shared/admin-sidebar"
import { AdminHeader } from "@/components/shared/admin-header"

export default function ExamSetupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-foreground">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main offset */}
      <div className="pl-72 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 p-8 space-y-6 container-app">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-zinc-800 dark:text-zinc-200">Exam Configuration</span>
          </div>

          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
            <h1 className="font-heading text-2xl font-bold tracking-tight select-none">
              Exam Configuration Setup
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl select-none">
              Configure parameters, rules, candidate listings, scheduling windows, and proctoring locks for active examination structures.
            </p>
          </div>

          {/* Placeholder visual Card */}
          <Card className="shadow-none border-dashed border-2 py-16">
            <CardContent className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
              <div className="h-16 w-16 rounded-full bg-purple-50 text-primary flex items-center justify-center dark:bg-purple-950/20">
                <Sliders className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 select-none">
                  Owning Team: Team 3
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed select-none">
                  This capability (BRD Section 4.3 — Exam Configuration Setup) is owned by <strong>Team 3 — Taking the Exam / Exam Config</strong>. Integration links between Team 2 (Questions) and Team 3 (Exams) will be established in the next sprint phase.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 select-none">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/question-bank")}
                  className="gap-1.5 text-xs shadow-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Question Bank
                </Button>

                <Button
                  size="sm"
                  onClick={() => router.push("/question-editor?new=true")}
                  className="gap-1.5 bg-primary text-white hover:bg-primary/95 text-xs"
                >
                  Create Mock Question
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
