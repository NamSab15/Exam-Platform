'use client'

import React from "react"
import { ProctorSidebar } from "@/components/shared/proctor-sidebar"
import { ProctorHeader } from "./components/ProctorHeader"

export default function ProctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <ProctorSidebar />
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        <ProctorHeader />
        {children}
      </div>
    </div>
  )
}
