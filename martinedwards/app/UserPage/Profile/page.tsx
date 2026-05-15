"use client";

import { useEffect, useState } from "react";
import { User, LogOut, ChevronRight } from "lucide-react";
import UserShell from "../components/UserShell";

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
    } else {
      window.location.href = "/Login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/UserPage";
  };

  return (
    <div className="bg-[#46141A] min-h-screen"> 
      <UserShell isLoggedIn={isLoggedIn}>
        <div className="pt-40 pb-20 px-6 flex flex-col items-center min-h-screen relative z-10">
          <div className="w-full max-w-[700px] flex flex-col gap-5">
            
            {/* CARD ATAS: INFO USER */}
            <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-black/5 flex items-center gap-6">
              {/* ICON ORANG */}
              <div className="w-16 h-16 rounded-[22px] bg-[#46141A]/10 flex items-center justify-center text-[#46141A] shrink-0">
                <User size={35} fill="currentColor" className="opacity-80" />
              </div>

              {/* NAMA & NIS (SEJAJAR) */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-black leading-tight tracking-tight">
                  Martin Edwards
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NIS:</span>
                  <p className="text-gray-600 font-bold text-sm tracking-tight">
                    226110
                  </p>
                </div>
              </div>
            </div>

           <div className="rounded-[28px] shadow-xl border border-black/5">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-6 py-5 bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-300 rounded-[22px] group"
              >
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-[0.2em]">Keluar Akun</span>
                </div>
                <ChevronRight size={20} className="text-white/50 group-hover:text-white transition-colors" />
              </button>
            </div>

          </div>
        </div>
      </UserShell>
    </div>
  );
}