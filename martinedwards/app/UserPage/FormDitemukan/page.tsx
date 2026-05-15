"use client";

import { useEffect, useState } from "react";
import UserShell from "../components/UserShell";
import FormDitemukan from "../components/FormDitemukan";

export default function FormDitemukanPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
    if (status !== "true") window.location.href = "/Login";
  }, []);

  return (
    <UserShell isLoggedIn={isLoggedIn}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#46141A] -z-10">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] rounded-full blur-[120px] opacity-40 animate-blob"
          style={{ backgroundColor: '#C26067' }}
        />
        <div 
          className="absolute bottom-[0%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-2000"
          style={{ backgroundColor: '#8B3039' }}
        />
        <div 
          className="absolute top-[30%] right-[15%] w-[600px] h-[600px] rounded-full blur-[130px] opacity-25 animate-blob animation-delay-4000"
          style={{ backgroundColor: '#561C24' }}
        />
        <div 
          className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[110px] opacity-20 animate-blob animation-delay-2000"
          style={{ backgroundColor: '#C26067' }}
        />
      </div>

      <div className="pt-32 pb-20 px-6 flex flex-col items-center min-h-screen relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-[0.4em] leading-relaxed">
              Lapor <span className="font-bold">Ditemukan</span>
            </h1>
            
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="h-[1px] w-12 bg-white/30"></div>
              <span className="text-[11px] tracking-[0.5em] font-bold text-[#C26067] uppercase bg-white/5 px-4 py-1.5 rounded-full border border-[#C26067]/20 text-center">
                Berikan laporan anda secara detail tentang barang tersebut
              </span>
              <div className="h-[1px] w-12 bg-white/30"></div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
            <FormDitemukan />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </UserShell>
  );
}