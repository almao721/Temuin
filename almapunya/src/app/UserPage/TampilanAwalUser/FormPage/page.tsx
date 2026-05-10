"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();

  // GANTI TRUE/FALSE
  const isLogin = false;

  const handleRedirect = () => {
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/TampilanAwalUser");
    }
  };

  return (
    <div
      id="form"
      className="relative overflow-hidden px-6 md:px-16 py-24 md:py-32"
    >

      {/* ICON TENGAH */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[46%] md:top-1/2 md:-translate-y-1/2 z-20">

        <div className="bg-[#A73446] p-4 md:p-5 rounded-[22px] shadow-[0_10px_25px_rgba(101,26,39,0.20)]">

          <FileText
            className="text-white"
            size={32}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10">

        {/* KIRI */}
        <div className="flex flex-col gap-5 w-full max-w-[430px]">

          {/* CARD */}
          <div className="bg-[#651A27] rounded-[28px] p-7 md:p-9 shadow-[0_12px_30px_rgba(0,0,0,0.10)]">

            <h1 className="text-white text-[28px] md:text-[40px] font-bold text-center leading-tight">
              Lapor Barang Ditemukan
            </h1>

            <p className="text-white/90 text-center mt-5 md:mt-6 text-sm md:text-lg leading-relaxed">
              Segera laporkan barang Anda yang ditemukan
              untuk membantu proses pencarian menjadi lebih cepat.
            </p>

            <button
              onClick={handleRedirect}
              className="w-full bg-white text-[#651A27] py-3.5 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300"
            >
              Lapor Barang Ditemukan
            </button>
          </div>

          {/* LIST */}
          <div className="bg-[#FFF8F5] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">

            <h1 className="font-bold text-sm md:text-base mb-3 text-[#651A27]">
              Kami tidak menerima jenis laporan barang:
            </h1>

            <ol className="list-decimal ml-5 text-xs md:text-sm text-[#651A27] space-y-1.5 leading-relaxed">

              <li>Senjata tajam</li>
              <li>Uang</li>
              <li>Produk tembakau dan rokok elektronik</li>
              <li>Barang berbahaya atau ilegal lainnya</li>
              <li>Barang yang tidak dapat dibuktikan kepemilikannya</li>
            </ol>
          </div>
        </div>

        {/* KANAN */}
        <div className="relative flex flex-col items-center w-full max-w-[430px]">

          {/* BURUNG */}
          <img
            src="/Assets/default birdie.png"
            alt="bird"
            className="w-28 md:w-36 absolute -top-16 md:-top-24 z-10"
          />

          {/* CARD */}
          <div className="bg-[#FFF8F5] rounded-[28px] p-7 md:p-9 shadow-[0_12px_30px_rgba(0,0,0,0.08)] w-full pt-20 md:pt-24">

            <h1 className="text-[#651A27] text-[28px] md:text-[40px] font-bold text-center leading-tight">
              Lapor Barang Hilang
            </h1>

            <p className="text-center mt-5 md:mt-6 text-sm md:text-lg leading-relaxed text-black/75">
              Lengkapi form kami tentang barang Anda lalu
              kami akan memprosesnya dengan segera.
            </p>

            <button
              onClick={handleRedirect}
              className="w-full bg-[#651A27] text-white py-3.5 rounded-xl font-semibold mt-8 hover:scale-[1.02] duration-300"
            >
              Lapor Barang Kehilangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}