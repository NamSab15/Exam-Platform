'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, HelpCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  timerCount?: string; // Optional exam timer
}

export function AdminHeader({
  onSearchChange,
  searchValue = "",
  timerCount,
}: AdminHeaderProps) {
  const pathname = usePathname()

  const isEditor = pathname === "/question-editor"
  const isCandidate = pathname === "/candidate-preview"

  const navTabs = [
    { name: "Question Bank", href: "/question-bank", active: pathname === "/question-bank" },
    { name: "Editor", href: "/question-editor", active: pathname === "/question-editor" },
    { name: "Exam Setup", href: "/exam-setup", active: pathname === "/exam-setup" },
  ]

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-white px-6 dark:bg-zinc-950">
      {/* Left Brand */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {/* SVG Xebia Brand Icon */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-heading font-extrabold text-sm select-none">
            X
          </div>
          <span className="font-heading text-lg font-bold text-primary select-none">
            Xebia Exam Platform
          </span>
        </div>

        {/* Editor Page Navigation Tabs */}
        {isEditor && (
          <nav className="hidden md:flex items-center gap-6 self-stretch ml-4">
            {navTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex h-16 items-center border-b-2 px-1 text-sm font-semibold transition-colors select-none",
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Middle Search or Content */}
      <div className="flex-1 max-w-md mx-6">
        {!isEditor && (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={isCandidate ? "Search questions..." : "Search questions, creators, or topics..."}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-zinc-50 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900"
            />
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Candidate Timer */}
        {isCandidate && (timerCount || true) && (
          <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 select-none animate-pulse">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="font-mono text-sm font-semibold">
              {timerCount || "01:45:20"}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative rounded-full p-1.5 text-muted-foreground hover:bg-zinc-50 hover:text-foreground transition-colors dark:hover:bg-zinc-900">
          <Bell className="h-5 w-5" />
          {/* Bell active dot (only on Dashboard or when needed) */}
          {!isEditor && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
          )}
        </button>

        {/* Help */}
        <button className="rounded-full p-1.5 text-muted-foreground hover:bg-zinc-50 hover:text-foreground transition-colors dark:hover:bg-zinc-900">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Profile Avatar */}
        <div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-200 select-none">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
