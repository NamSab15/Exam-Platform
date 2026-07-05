'use client'

import React from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, HelpCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AdminHeaderProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  timerCount?: string;
}

export function AdminHeader({
  onSearchChange,
  searchValue,
  timerCount,
}: AdminHeaderProps) {
  const pathname = usePathname()
  const [localSearch, setLocalSearch] = React.useState("")

  const isCandidate = pathname === "/candidate-preview"
  const hasSidebar = !isCandidate

  // Fallback to local state if no onSearchChange prop is passed
  const value = onSearchChange ? (searchValue ?? "") : localSearch

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b border-border bg-white px-4 sm:px-6 lg:px-8 dark:bg-zinc-950">
      {/* Left Brand */}
      <div className={cn("flex min-w-0 items-center gap-4 sm:gap-6", hasSidebar && "pl-10 lg:pl-0")}>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-auto shrink-0 items-center select-none" aria-hidden="true">
            <Image
              src="/logo.png"
              alt="Xebia Logo"
              width={34}
              height={28}
              priority
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="hidden truncate font-heading text-base font-bold text-primary select-none sm:block lg:text-lg">
            Xebia Exam Platform
          </span>
        </div>
      </div>

      {/* Middle Search */}
      <div className="mx-auto hidden min-w-0 flex-1 sm:block sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={
              isCandidate
                ? "Search questions..."
                : "Search questions, creators, or topics..."
            }
            value={value}
            onChange={(e) => {
              if (onSearchChange) {
                onSearchChange(e.target.value)
              } else {
                setLocalSearch(e.target.value)
              }
            }}
            aria-label="Search questions"
            className="h-10 w-full rounded-full border border-border bg-zinc-50 pl-11 pr-4 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {isCandidate && timerCount && (
          <div
            className="flex items-center gap-2 rounded-full bg-rose-50 px-2.5 py-1 text-rose-600 select-none sm:px-3 dark:bg-rose-950/30 dark:text-rose-400"
            role="timer"
            aria-live="polite"
            aria-label={`Time remaining: ${timerCount}`}
          >
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold sm:text-sm">{timerCount}</span>
          </div>
        )}

        <button
          type="button"
          className="relative rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:hover:bg-zinc-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:hover:bg-zinc-900"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div
          className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-200 select-none"
          role="img"
          aria-label="User profile"
        >
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
