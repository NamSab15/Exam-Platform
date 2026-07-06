"use client";

import Link from "next/link";
import { Settings, HelpCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  isSidebar?: boolean;
}

export default function BottomNav({ isSidebar = false }: BottomNavProps) {
  const pathname = usePathname();

  const containerClass = isSidebar
    ? "mt-auto pt-6 px-3 flex flex-col gap-4 border-t border-[#d5c1cc]/30"
    : "fixed bottom-4 left-4 z-40 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg";

  const linkClass = "flex items-center gap-[10px] text-[#83727c] text-[16px] font-sans font-medium hover:text-primary transition-colors cursor-pointer decoration-none";
  const activeLinkClass = "flex items-center gap-[10px] text-primary text-[16px] font-sans font-bold cursor-default decoration-none";

  return (
    <div className={containerClass}>
      <Link 
        href="/users" 
        className={pathname === "/users" ? activeLinkClass : linkClass}
      >
        <Users size={22} className="shrink-0" />
        <span>Users</span>
      </Link>
      <Link 
        href="/org-settings" 
        className={pathname === "/org-settings" ? activeLinkClass : linkClass}
      >
        <Settings size={22} className="shrink-0" />
        <span>Settings</span>
      </Link>
      <div className={linkClass}>
        <HelpCircle size={22} className="shrink-0" />
        <span>Support</span>
      </div>
    </div>
  );
}
