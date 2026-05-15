"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../Navbar/Navbar"; 
import Kategori from "../components/Kategori";
import FormKehilangan from "../components/FormKehilangan";

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";
  const [showKategori, setShowKategori] = useState(!categoryFromUrl);

  return (
    <>
      {/* BACKGROUND ANIMASI 3 WARNA */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#46141A] -z-10">
        {/* Bulatan Warna 1: #C26067 */}
        <div 
          className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-60 animate-mesh-1"
          style={{ backgroundColor: '#C26067' }}
        />
        {/* Bulatan Warna 2: #8B3039 */}
        <div 
          className="absolute bottom-[5%] right-[-10%] w-[900px] h-[900px] rounded-full blur-[100px] opacity-50 animate-mesh-2"
          style={{ backgroundColor: '#8B3039' }}
        />
        {/* Bulatan Warna 3: #561C24 */}
        <div 
          className="absolute top-[30%] left-[20%] w-[700px] h-[700px] rounded-full blur-[130px] opacity-40 animate-mesh-3"
          style={{ backgroundColor: '#561C24' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-[0.4em] leading-relaxed">
            Lapor <span className="font-bold">Kehilangan</span>
          </h1>
          
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="h-[1px] w-12 bg-white/30"></div>
            <span className="text-[11px] tracking-[0.5em] font-bold text-[#C26067] uppercase bg-white/5 px-4 py-1.5 rounded-full border border-[#C26067]/20">
              {categoryFromUrl ? `KATEGORI: ${categoryFromUrl}` : "Formulir Kehilangan"}
            </span>
            <div className="h-[1px] w-12 bg-white/30"></div>
          </div>
          
          <p className="text-white/50 font-medium text-[10px] mt-8 tracking-[0.3em] uppercase">
            Sampaikan detail barang anda untuk membantu proses pencarian
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
          <FormKehilangan initialKategori={categoryFromUrl} />
        </div>
      </div>

      <Kategori 
        isOpen={showKategori} 
        onClose={() => setShowKategori(false)} 
        onSelect={(id) => {
          setShowKategori(false);
          router.push(`/UserPage/FormKehilangan?category=${id}`);
        }}
      />

      <style jsx global>{`
        @keyframes mesh-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, 50px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, -100px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-3 {
          0% { transform: translate(0, 0) scale(1.2); }
          50% { transform: translate(50px, -50px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1.2); }
        }
        .animate-mesh-1 {
          animation: mesh-1 12s infinite ease-in-out;
        }
        .animate-mesh-2 {
          animation: mesh-2 15s infinite ease-in-out;
        }
        .animate-mesh-3 {
          animation: mesh-3 18s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#46141A] pt-32 pb-20 px-5 overflow-hidden">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#C26067] rounded-full animate-spin"></div>
          <p className="text-white font-light tracking-[0.3em] opacity-50 text-[10px]">MENYIAPKAN FORMULIR...</p>
        </div>
      }>
        <FormContent />
      </Suspense>
    </main>
  );
}