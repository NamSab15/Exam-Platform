import Image from "next/image";

export default function AppNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e4e2e2] flex items-center px-6 z-50 select-none"
      aria-label="Global Application Navigation"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/Logo-Purple.png"
          alt="Xebia logo"
          height={32}
          width={32}
          className="h-8 w-auto object-contain"
          priority
        />
        <span className="font-sans font-semibold text-[16px] leading-[24px] text-[#510047] tracking-tight">
          Xebia Exam Platform
        </span>
      </div>
    </nav>
  );
}
