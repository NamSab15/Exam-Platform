import { Settings, HelpCircle } from "lucide-react";

interface BottomNavProps {
  isSidebar?: boolean;
}

export default function BottomNav({ isSidebar = false }: BottomNavProps) {
  const containerClass = isSidebar
    ? "mt-auto pt-6 px-3 flex flex-col gap-4 border-t border-[#d5c1cc]/30"
    : "fixed bottom-4 left-4 z-40 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-[10px] text-[#83727c] text-[16px] font-sans font-medium select-none">
        <Settings size={22} className="shrink-0" />
        <span>Settings</span>
      </div>
      <div className="flex items-center gap-[10px] text-[#83727c] text-[16px] font-sans font-medium select-none">
        <HelpCircle size={22} className="shrink-0" />
        <span>Support</span>
      </div>
    </div>
  );
}
