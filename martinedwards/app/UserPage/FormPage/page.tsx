"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Kategori from "../components/Kategori"; // Pastikan path ke file Kategori.tsx benar

interface FormPageProps {
  isLoggedIn?: boolean;
}

export default function FormPage({ isLoggedIn = false }: FormPageProps) {
  const router = useRouter();
  const [showKategori, setShowKategori] = useState(false);

  const handleNavigation = (path: string) => {
    if (!isLoggedIn) {
      router.push("/Login");
      return;
    }

    if (path === "/UserPage/FormKehilangan") {
      // ALUR KHUSUS: Munculkan popup kategori dulu, jangan pindah page
      setShowKategori(true);
    } else {
      router.push(path);
    }
  };

  // Fungsi ini jalan setelah user pilih salah satu kategori di popup
  const handleKategoriSelect = (id: string) => {
    setShowKategori(false);
    // Baru pindah ke FormKehilangan dengan membawa data kategori via URL
    router.push(`/UserPage/FormKehilangan?category=${id}`);
  };

  return (
    <>
      <div id="form" className="relative pt-40 pb-20 px-5 md:px-16 flex items-center justify-center min-h-screen">
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-end justify-center gap-10 md:gap-6">
          
          {/* KOTAK KIRI: LAPOR DITEMUKAN */}
          <div className="flex flex-col gap-5 w-full max-w-[350px]">
            <div className="bg-[#46141A] rounded-[24px] p-8 h-[300px] flex flex-col justify-center border border-white/5 shadow-[12px_12px_0px_rgba(0,0,0,0.25)]">
              <h3 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
                Lapor Barang Ditemukan
              </h3>
              <p className="text-white/70 text-center mt-4 text-xs md:text-sm leading-relaxed">
                Bantu kembalikan barang temuan kepada pemiliknya dengan cepat.
              </p>
              <button 
                onClick={() => handleNavigation("/UserPage/FormDitemukan")}
                className="w-full bg-white text-[#46141A] py-3 rounded-xl font-bold mt-6 hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-sm"
              >
                Lapor Barang Ditemukan
              </button>
            </div>

            <div className="bg-white rounded-[20px] p-5 text-[#46141A] shadow-[8px_8px_0px_rgba(0,0,0,0.15)] border border-black/5">
              <h4 className="font-bold text-[11px] md:text-xs mb-2 uppercase tracking-tight opacity-80">
                Kami tidak menerima jenis laporan barang:
              </h4>
              <ol className="list-decimal ml-4 text-[10px] md:text-[11px] font-medium space-y-1 opacity-90">
                <li>Senjata tajam</li>
                <li>Uang</li>
                <li>Produk tembakau dan rokok elektronik</li>
                <li>Barang berbahaya atau ilegal lainnya</li>
                <li>Barang yang tidak dapat dibuktikan kepemilikannya</li>
              </ol>
            </div>
          </div>

          {/* KOTAK KANAN: LAPOR KEHILANGAN */}
          <div className="flex flex-col w-full max-w-[350px] relative mt-24 lg:mt-0">
            {isLoggedIn ? (
              <div className="absolute -top-[115px] left-1/2 -translate-x-1/2 w-64 z-20 pointer-events-none">
                 <img 
                   src="/Assets/wave birdie.png" 
                   alt="Birdwave" 
                   className="w-full h-auto object-contain" 
                 />
              </div>
            ) : (
              <div className="absolute -top-20 left-0 w-full text-center px-5">
                  <p className="text-white text-lg md:text-xl italic font-medium drop-shadow-lg opacity-90">
                    Silakan login terlebih dahulu untuk mulai mengisi laporan.
                  </p>
              </div>
            )}

            <div className="bg-white rounded-[24px] p-8 h-[300px] flex flex-col justify-center border border-black/5 shadow-[12px_12px_0px_rgba(0,0,0,0.25)] text-[#46141A]">
              <h3 className="text-2xl md:text-3xl font-bold text-center leading-tight">
                Lapor Barang Kehilangan
              </h3>
              <p className="text-center mt-4 text-xs md:text-sm leading-relaxed opacity-70">
                Lengkapi form kami tentang barang anda lalu kami akan memprosesnya dengan segera.
              </p>
              <button 
                onClick={() => handleNavigation("/UserPage/FormKehilangan")}
                className="w-full bg-[#46141A] text-white py-3 rounded-xl font-bold mt-8 hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)] text-sm"
              >
                Lapor Barang Kehilangan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP KATEGORI: Tampil di atas FormPage saat showKategori true */}
      <Kategori 
        isOpen={showKategori} 
        onClose={() => setShowKategori(false)} 
        onSelect={handleKategoriSelect}
      />
    </>
  );
}