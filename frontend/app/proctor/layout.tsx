'use client'

import React from "react"
import { AdminSidebar } from "@/components/shared/admin-sidebar"

export default function ProctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        {children}
      </div>
    </div>
  )
}
