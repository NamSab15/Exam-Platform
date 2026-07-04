'use client'

import React, { Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, Bell, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

function ProctorHeaderContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const isEditor = pathname === "/question-editor"
  const isCandidate = pathname === "/candidate-preview"
  const hasSidebar = !isCandidate

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set("search", val)
    } else {
      params.delete("search")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const navTabs = [
    { name: "Question Bank", href: "/question-bank", active: pathname === "/question-bank" },
    { name: "Editor", href: "/question-editor", active: pathname === "/question-editor" },
    { name: "Exam Setup", href: "/exam-setup", active: pathname === "/exam-setup" },
  ]

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b border-border bg-white px-4 sm:px-6 lg:px-8 dark:bg-zinc-950">
      {/* Left Brand */}
      <div className={cn("flex min-w-0 items-center gap-4 sm:gap-6", hasSidebar && "pl-10 lg:pl-0")}>
        <div className="flex min-w-0 items-center gap-2">
          {/* Logo in front of Xebia Exam Platform */}
          <div className="relative h-7 w-7 shrink-0 select-none">
            <Image
              src="/Logo-Purple.png"
              alt="Logo"
              width={28}
              height={28}
              className="h-full w-full object-contain dark:hidden"
            />
            <Image
              src="/Logo-White.png"
              alt="Logo"
              width={28}
              height={28}
              className="hidden h-full w-full object-contain dark:block"
            />
          </div>
          <span className="hidden truncate font-heading text-base font-bold text-primary select-none sm:block lg:text-lg">
            Xebia Exam Platform
          </span>
        </div>

        {isEditor && (
          <nav className="hidden items-center gap-4 self-stretch md:flex lg:gap-6" aria-label="Section navigation">
            {navTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex h-16 items-center border-b-2 px-1 text-sm font-semibold transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                aria-current={tab.active ? "page" : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Middle Search */}
      <div className="mx-auto hidden min-w-0 flex-1 sm:block sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
        {!isEditor && (
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search questions, candidates, or events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search questions"
              className="h-10 w-full rounded-full border border-border bg-zinc-50 pl-11 pr-4 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:bg-zinc-900"
            />
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:hover:bg-zinc-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {!isEditor && (
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950"
              aria-hidden="true"
            />
          )}
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
            alt="User profile"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}

export function ProctorHeader() {
  return (
    <Suspense fallback={<div className="h-16 border-b border-border bg-white" />}>
      <ProctorHeaderContent />
    </Suspense>
  )
}
