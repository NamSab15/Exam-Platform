'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Database,
  FileEdit,
  Sliders,
  Settings,
  HelpCircle,
  Plus,
  History,
  BarChart2
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    {
      name: "Question Bank",
      href: "/question-bank",
      icon: Database,
      active: pathname === "/question-bank",
    },
    {
      name: "Editor",
      href: "/question-editor",
      icon: FileEdit,
      active: pathname === "/question-editor",
    },
    {
      name: "Exam Setup",
      href: "/exam-setup",
      icon: Sliders,
      active: pathname === "/exam-setup",
    },
  ]

  // Extra nav items that appear in the Editor sidebar
  const isEditorView = pathname === "/question-editor"
  const editorNavItems = [
    {
      name: "Version History",
      href: "#",
      icon: History,
      active: false,
    },
    {
      name: "Performance Analytics",
      href: "#",
      icon: BarChart2,
      active: false,
    },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-border bg-white px-5 py-6 dark:bg-zinc-950">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-heading font-bold text-lg select-none">
          X
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold text-primary leading-tight">
            Exam Manager
          </span>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase leading-none">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 space-y-6">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors select-none",
                  item.active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-900"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Editor Sidebar Sub-Items if on Editor page */}
        {isEditorView && (
          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in duration-300">
            {editorNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors select-none",
                    item.active
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 px-2">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase select-none block mb-3">
            Quick Actions
          </span>
          <Link
            href="/exam-setup"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#510047] hover:bg-[#6c1d5f] text-white px-4 py-2.5 text-sm font-medium transition-colors shadow-sm select-none"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Create New Exam
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-900 transition-colors select-none"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-900 transition-colors select-none"
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          Support
        </Link>
      </div>
    </aside>
  )
}
