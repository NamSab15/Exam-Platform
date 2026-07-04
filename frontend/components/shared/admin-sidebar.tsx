'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Database,
  FileEdit,
  Sliders,
  Settings,
  HelpCircle,
  Plus,
  History,
  BarChart2,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navLinkClass = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    active
      ? "bg-secondary text-primary"
      : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-900"
  )

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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

  useEffect(() => {
    if (!mobileOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-foreground shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden dark:bg-zinc-950"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] flex-col border-r border-border bg-white py-6 transition-transform duration-200 ease-in-out dark:bg-zinc-950",
          "max-lg:shadow-xl",
          mobileOpen ? "translate-x-0" : "max-lg:-translate-x-full",
          "lg:translate-x-0"
        )}
        aria-label="Admin navigation"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 select-none">
              <Image
                src="/Logo-Purple.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain dark:hidden"
              />
              <Image
                src="/Logo-White.png"
                alt="Logo"
                width={40}
                height={40}
                className="hidden h-full w-full object-contain dark:block"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold leading-tight text-primary">
                Exam Manager
              </span>
              <span className="text-[10px] font-bold uppercase leading-none tracking-wider text-muted-foreground">
                Admin Console
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-1 flex-col overflow-y-auto px-4" aria-label="Main navigation">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={navLinkClass(item.active)}
                  aria-current={item.active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {isEditorView && (
            <div className="mt-6 space-y-1 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              {editorNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={navLinkClass(item.active)}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 px-1">
            <span className="section-label mb-3 block">Quick Actions</span>
            <Link
              href="/exam-setup"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 select-none"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              Create New Exam
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="space-y-1 border-t border-zinc-100 px-4 pt-4 dark:border-zinc-800">
          <Link
            href="#"
            className={navLinkClass(false)}
          >
            <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
          <Link
            href="#"
            className={navLinkClass(false)}
          >
            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Support
          </Link>
        </div>
      </aside>
    </>
  )
}
