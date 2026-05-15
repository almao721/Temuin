"use client";

import Navbar from "../Navbar/Navbar";

interface UserShellProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}

export default function UserShell({ children, isLoggedIn = false }: UserShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#5E1B24] overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] border border-white/10 rounded-full opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}